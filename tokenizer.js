const tpl = `
<div c-class='{"loading": !title}'>
    <p class="title">{{title}}</p>
</div>
`;

// <'open_tag', 'div' >
// <'attr_name', 'c-class'>
// <'=', '='>
// <'attr_value', '{"loading": !title}'>
// <'>', '>'>
// <'open_tag', 'p' >
// <'attr_name', 'class'>
// <'attr_value', 'title'>
// <'>', '>'>
// <'{{', '{{'>
// <'indent', 'title'>
// <'}}', '}}'>
// <'close_tag', 'p' >
// <'close_tag', 'div' >
// <'EOF', '-' >

const Character = {
  isWhiteSpace(cp) {
    return cp === 32;
  },
  isLetter(cp) {
    return (
      (cp >= 0x41 && cp <= 0x5a) || // A..Z
      (cp >= 0x61 && cp <= 0x7a) // a..z
    );
  },
  isChar(cp) {
    return (
      cp === 32 ||
      cp === 10 ||
      cp === 9 ||
      cp >= 0x30 && cp <= 0x39 ||
      (cp >= 0x41 && cp <= 0x5a) || // A..Z
      (cp >= 0x61 && cp <= 0x7a) // a..z
    );
  }
}

const TokenType = {};
TokenType.CHARACTER_TOKEN = 'CHARACTER_TOKEN';
TokenType.START_TAG_TOKEN = 'START_TAG_TOKEN';
TokenType.END_TAG_TOKEN = 'END_TAG_TOKEN';
TokenType.EOF_TOKEN = 'EOF_TOKEN';

const DATA_STATE = 'DATA_STATE';
const TAG_OPEN_STATE = 'TAG_OPEN_STATE';
const TAG_NAME_STATE = 'TAG_NAME_STATE';
const TAG_CLOSE_STATE = 'TAG_CLOSE_STATE';
const BEFORE_ATTRIBUTE_NAME_STATE = 'BEFORE_ATTRIBUTE_NAME_STATE';
const ATTRIBUTE_NAME_STATE = 'ATTRIBUTE_NAME_STATE';
const BEFORE_ATTRIBUTE_VALUE_STATE = 'BEFORE_ATTRIBUTE_VALUE_STATE';
const ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE';
const AFTER_ATTRIBUTE_VALUE_QUOTED_STATE = 'AFTER_ATTRIBUTE_VALUE_QUOTED_STATE';
const TEXT_STATE = 'TEXT_STATE';

class Scanner {
  constructor(code) {
    this.source = code;

    this.length = code.length;
    this.index = 0;

    this.state = DATA_STATE;
    this.currentToken = null;
    this.currentAttr = null;
    this.buffer = [];
  }

  eof() {
    return this.index >= this.length;
  }

  lex() {
    while (!this.buffer.length && !this.eof()) {
      const cp = this.source.charCodeAt(this.index);
      this[this.state](cp, this.source[this.index]);
    }
    return this.buffer.shift();
  }

  [DATA_STATE](cp) {
    if (Character.isWhiteSpace(cp) || cp === 10) { // \n
      ++this.index;
    } else if (cp === 60) { // <
      this.state = TAG_OPEN_STATE;
      ++this.index;
      if (this.source.charCodeAt(this.index) === 47) {
        this.state = TAG_CLOSE_STATE;
        ++this.index;
      }
    } else if (Character.isLetter(cp)) {
      this._createTextToken();
      this.state = TEXT_STATE;
    }
  }

  [TEXT_STATE](cp, c) {
    if (Character.isChar(cp)) {
      this.currentToken.value += c;
      ++this.index;
    } else if (cp === 60) {
      this._emitCurrentToken();
      this.state = DATA_STATE;
    }
  }

  [TAG_CLOSE_STATE](cp) {
    if (Character.isLetter(cp)) {
      this._createEndTagToken();
      this.state = TAG_NAME_STATE;
    }
  }

  [TAG_OPEN_STATE](cp) {
    if (Character.isLetter(cp)) {
      this._createStartTagToken();
      this.state = TAG_NAME_STATE;
    }
  }

  [TAG_NAME_STATE](cp, c) {
    if (Character.isLetter(cp)) {
      this.currentToken.value += c;
      ++this.index;
    } else if (Character.isWhiteSpace(cp)) {
      this.state = BEFORE_ATTRIBUTE_NAME_STATE;
      ++this.index;
    } else if (cp === 62) { // >
      this.state = DATA_STATE;
      ++this.index;
      this._emitCurrentToken();
    }
  }

  [BEFORE_ATTRIBUTE_NAME_STATE](cp) {
    if (Character.isLetter(cp)) {
      this._createAttr('');
      this.state = ATTRIBUTE_NAME_STATE;
    } else if (Character.isWhiteSpace(cp)) {
      ++this.index;
    }
  }

  [ATTRIBUTE_NAME_STATE](cp, c) {
    if (Character.isLetter(cp)) {
      this.currentAttr.name += c;
      ++this.index;
    } else if (cp === 61) { // =
      this.state = BEFORE_ATTRIBUTE_VALUE_STATE;
      ++this.index;
    }
  }

  [BEFORE_ATTRIBUTE_VALUE_STATE](cp) {
    if (cp === 34) { // "
      this.state = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
      ++this.index;
    }
  }

  [ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE](cp, c) {
    if (Character.isLetter(cp)) {
      this.currentAttr.value += c;
      ++this.index;
    } else if (cp === 34) { // "
      this.currentToken.attrs.push(this.currentAttr)
      this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
      ++this.index;
    }
  }

  [AFTER_ATTRIBUTE_VALUE_QUOTED_STATE](cp) {
    if (cp === 62) { // >
      this.state = DATA_STATE;
      ++this.index;
      this._emitCurrentToken();
    } else if (Character.isWhiteSpace(cp)) {
      this.state = BEFORE_ATTRIBUTE_NAME_STATE;
      ++this.index;
    }
  }

  _emitCurrentToken() {
    const ct = this.currentToken;
    this.buffer.push(ct);
  }

  _createAttr(attrNameFirstCh) {
    this.currentAttr = {
      name: attrNameFirstCh,
      value: ''
    };
  }

  _createStartTagToken() {
    this.currentToken = {
      type: TokenType.START_TAG_TOKEN,
      value: '',
      attrs: []
    };
  }

  _createEndTagToken() {
    this.currentToken = {
      type: TokenType.END_TAG_TOKEN,
      value: ''
    };
  }

  _createTextToken() {
    this.currentToken = {
      type: TokenType.CHARACTER_TOKEN,
      value: ''
    };
  }

}

class Tokenizer {
  constructor(code) {
    this.scanner = new Scanner(code);
  }
  getNextToken() {
    if (!this.scanner.eof()) {
      let token = this.scanner.lex();
      if (token) {
        return token;
      }
    }
  }
}

const tokenizer = new Tokenizer(`
<div class="main" id="hello">
  <p>hello world</p>
</div>
`);

let tokens = [];

try {
  while (true) {
    let token = tokenizer.getNextToken();
    if (!token) {
      break;
    }
    tokens.push(token);
  }
} catch (e) {
  console.error(e);
}

console.log(tokens)
