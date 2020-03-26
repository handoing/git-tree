require('./polyfill/startsWith');

const fs = require("fs");
const readlineSync = require('readline-sync');

const KW_APPEND = '来了个'
const KW_ASSERT = '保准'
const KW_ASSERT_FALSE = '辟谣'
const KW_BANG = '！'
const KW_BASE_INIT = '领导的新对象'
const KW_BECOME = '装'
const KW_BEGIN = '开整：'
const KW_BREAK = '尥蹶子'
const KW_CALL = '整'
const KW_CHECK = '寻思：'
const KW_CLASS = '阶级'
const KW_CLOSE_BRACKET = '」'
const KW_CLOSE_PAREN = '）'
const KW_CLOSE_PAREN_NARROW = ')'
const KW_CLOSE_QUOTE = '”'
const KW_COLON = '：'
const KW_COLON_NARROW = ':'
const KW_COMMA = '，'
const KW_COMMA_NARROW = ','
const KW_COMPARE = '比'
const KW_COMPARE_WITH = '跟'
const KW_CONCAT = '、'
const KW_CONTINUE = '接着磨叽'
const KW_DEC = '稍稍'
const KW_DEC_BY = '稍'
const KW_DEL = '炮决'
const KW_DOT = '的'
const KW_SET_NONE = '削'
const KW_DERIVED = '的接班银'
const KW_DIVIDE_BY = '除以'
const KW_ELSE = '要不行咧就'
const KW_END = '整完了'
const KW_END_LOOP = '磨叽完了'
const KW_EQUAL = '一样一样的'
const KW_EXTEND = '来了群'
const KW_FROM = '从'
const KW_DEF = '咋整：'
const KW_GREATER = '还大'
const KW_IMPORT = '翠花，上'
const KW_IN = '在'
const KW_INC = '走走'
const KW_INC_BY = '走'
const KW_INDEX_1 = '的老大'
const KW_INDEX_LAST = '的老幺'
const KW_INDEX = '的老'
const KW_1_INFINITE_LOOP = '从一而终磨叽：'
const KW_1_INFINITE_LOOP_EGG = '在苹果总部磨叽：'
const KW_INTEGER_DIVIDE_BY = '齐整整地除以'
const KW_IS_LIST = '都是活雷锋'
const KW_IS_NONE = '啥也不是'
const KW_IS_VAR = '是活雷锋'
const KW_LENGTH = '有几个坑'
const KW_LESS = '还小'
const KW_LOOP = '磨叽：'
const KW_MINUS = '减'
const KW_MODULO = '刨掉一堆堆'
const KW_NEGATE = '拉饥荒'
const KW_NEW_OBJECT_OF = '的新对象'
const KW_NOT_EQUAL = '不是一样一样的'
const KW_OPEN_BRACKET = '「'
const KW_OPEN_BRACKET_VERBOSE = '路银「'
const KW_OPEN_PAREN = '（'
const KW_OPEN_PAREN_NARROW = '('
const KW_OPEN_QUOTE = '“'
const KW_PERIOD = '。'
const KW_PLUS = '加'
const KW_RAISE = '整叉劈了：'
const KW_REMOVE_HEAD = '掐头'
const KW_REMOVE_TAIL = '去尾'
const KW_RETURN = '滚犊子吧'
const KW_SAY = '唠唠'
const KW_STEP = '步'
const KW_THEN = '？要行咧就'
const KW_TIMES = '乘'
const KW_TUPLE = '抱团'
const KW_TO = '到'

const KEYWORDS = [
    KW_APPEND,
    KW_ASSERT,
    KW_ASSERT_FALSE,
    KW_BANG,
    KW_BASE_INIT,
    KW_BECOME,
    KW_BEGIN,
    KW_BREAK,
    KW_CHECK,
    KW_CLASS,
    KW_CLOSE_BRACKET,
    KW_CLOSE_PAREN,
    KW_CLOSE_PAREN_NARROW,
    KW_CLOSE_QUOTE,
    KW_COLON,
    KW_COLON_NARROW,
    KW_COMMA,
    KW_COMMA_NARROW,
    KW_COMPARE,
    KW_COMPARE_WITH,
    KW_CONCAT,
    KW_CONTINUE,
    KW_DEC,
    KW_DEC_BY,
    KW_DEL,
    KW_DERIVED,
    KW_SET_NONE,
    KW_DIVIDE_BY,
    KW_ELSE,
    KW_EXTEND,
    KW_END,
    KW_RAISE,
    KW_CALL,
    KW_END_LOOP,
    KW_EQUAL,
    KW_1_INFINITE_LOOP,
    KW_FROM,
    KW_DEF,
    KW_GREATER,
    KW_IMPORT,
    KW_1_INFINITE_LOOP_EGG,
    KW_IN,
    KW_INC,
    KW_INC_BY,
    KW_INDEX_1,
    KW_INDEX_LAST,
    KW_INDEX,
    KW_NEW_OBJECT_OF,
    KW_DOT,
    KW_INTEGER_DIVIDE_BY,
    KW_IS_LIST,
    KW_IS_NONE,
    KW_IS_VAR,
    KW_LENGTH,
    KW_LESS,
    KW_LOOP,
    KW_MINUS,
    KW_MODULO,
    KW_NEGATE,
    KW_NOT_EQUAL,
    KW_OPEN_BRACKET,
    KW_OPEN_BRACKET_VERBOSE,
    KW_OPEN_PAREN,
    KW_OPEN_PAREN_NARROW,
    KW_OPEN_QUOTE,
    KW_PERIOD,
    KW_PLUS,
    KW_REMOVE_HEAD,
    KW_REMOVE_TAIL,
    KW_RETURN,
    KW_SAY,
    KW_STEP,
    KW_THEN,
    KW_TIMES,
    KW_TUPLE,
    KW_TO,
];

// Maps a keyword to its normalized form.
const KEYWORD_TO_NORMALIZED_KEYWORD = {};
KEYWORD_TO_NORMALIZED_KEYWORD[KW_BANG] = KW_PERIOD;
KEYWORD_TO_NORMALIZED_KEYWORD[KW_OPEN_PAREN_NARROW] = KW_OPEN_PAREN;
KEYWORD_TO_NORMALIZED_KEYWORD[KW_CLOSE_PAREN_NARROW] = KW_CLOSE_PAREN;
KEYWORD_TO_NORMALIZED_KEYWORD[KW_COLON_NARROW] = KW_COLON;
KEYWORD_TO_NORMALIZED_KEYWORD[KW_COMMA_NARROW] = KW_COMMA;
KEYWORD_TO_NORMALIZED_KEYWORD[KW_OPEN_BRACKET_VERBOSE] = KW_OPEN_BRACKET;

// Types of tokens.
const TK_KEYWORD = 'KEYWORD'
const TK_IDENTIFIER = 'IDENTIFIER'
const TK_STRING_LITERAL = 'STRING'
const TK_NON_TERMINATING_STRING_LITERAL = 'NON_TERMINATING_STRING'
const TK_NUMBER_LITERAL = 'NUMBER'
const TK_NONE_LITERAL = 'NONE'
const TK_CHAR = 'CHAR'


// Statements.
const STMT_APPEND = 'APPEND'
const STMT_ASSERT = 'ASSERT'
const STMT_ASSERT_FALSE = 'ASSERT_FALSE'
const STMT_ASSIGN = 'ASSIGN'
const STMT_BREAK = 'BREAK'
const STMT_CALL = 'CALL'
const STMT_CLASS_DEF = 'CLASS'
const STMT_COMPOUND = 'COMPOUND'
const STMT_CONDITIONAL = 'CONDITIONAL'
const STMT_CONTINUE = 'CONTINUE'
const STMT_DEC_BY = 'DEC_BY'
const STMT_DEL = 'DEL'
const STMT_SET_NONE = 'SET_NONE'
const STMT_EXPR = 'EXPR'
const STMT_EXTEND = 'EXTEND'
const STMT_FUNC_DEF = 'FUNC_DEF'
const STMT_IMPORT = 'IMPORT'
const STMT_INC_BY = 'INC_BY'
const STMT_INFINITE_LOOP = 'INFINITE_LOOP'
const STMT_LIST_VAR_DECL = 'LIST_VAR_DECL'
const STMT_LOOP = 'LOOP'
const STMT_RAISE = 'RAISE'
const STMT_RANGE_LOOP = 'RANGE_LOOP'
const STMT_RETURN = 'RETURN'
const STMT_SAY = 'SAY'
const STMT_VAR_DECL = 'VAR_DECL'

function _dongbei_print(str) {
    console.log(str);
}

function *_dongbei_1_infinite_loop() {
    while (true) {
        yield 1;
    }
}

function range(start, end, step = 1) {
	let arr = [];
	for(let i=start; i < end; i++){
		if(i%step==0){arr.push(i)}
	}
	return arr;
}

class SourceLoc {
    constructor(filepath = '<unknown>', line = 1, column = 0) {
        this.filepath = filepath
        this.line = line
        this.column = column
    }
    clone() {
        return new SourceLoc(this.filepath, this.line, this.column);
    }
    advance(string) {
        for (let i in string) {
            let char = string.charAt(i);
            if (char == '\n') {
                this.line += 1
                this.column = 0
            } else {
                this.column += 1
            }
        }
    }
    equal(other) {
        return this.filepath == other.filepath &&
            this.line == other.line &&
            this.column == other.column;
    }
}

class SourceCodeAndLoc {
    constructor(code, loc) {
        this.code = code || '';
        if (loc) {
            this.loc = loc.clone()
        } else {
            this.loc = new SourceLoc();
        }
    }
    skipChar() {
        this.loc.advance(this.code[0])
        this.code = this.code.substring(1);
    }
    clone() {
        return new SourceCodeAndLoc(this.code, this.loc.clone());
    }
}

function Token(kind, value, loc) {
    return {
        kind: kind,
        value: value,
        loc: loc ? loc.clone() : new SourceLoc(),
        equal: function(other) {
            return other &&
                this.kind == other.kind &&
                this.value == other.value;
        }
    }
};

function IdentifierToken(name, loc) {
    return Token(TK_IDENTIFIER, name, loc)
}

function ConcatExpr(exprs) {
    return {
        exprs,
        toJavaScript: function() {
            return this.exprs.map((expr) => {
                return expr.toJavaScript()
            }).join('+')
        }
    }
}

const ARITHMETIC_OPERATION_TO_PYTHON = {}
ARITHMETIC_OPERATION_TO_PYTHON[KW_PLUS] = '+'
ARITHMETIC_OPERATION_TO_PYTHON[KW_MINUS] = '-'
ARITHMETIC_OPERATION_TO_PYTHON[KW_TIMES] = '*'
ARITHMETIC_OPERATION_TO_PYTHON[KW_DIVIDE_BY] = '/'
ARITHMETIC_OPERATION_TO_PYTHON[KW_INTEGER_DIVIDE_BY] = '//'
ARITHMETIC_OPERATION_TO_PYTHON[KW_MODULO] = '%'

function ArithmeticExpr(op1, operation, op2) {
    return {
        op1,
        operation,
        op2,
        toJavaScript: function() {
            return `${op1.toJavaScript()} ${ARITHMETIC_OPERATION_TO_PYTHON[this.operation.value]} ${op2.toJavaScript()}`
        }
    }
}

function LiteralExpr(token) {
    return {
        token: token,
        toJavaScript: function() {
            if (this.token.kind == TK_NUMBER_LITERAL) {
                return String(this.token.value)
            }
            if (this.token.kind == TK_STRING_LITERAL) {
                return `"${this.token.value}"`
            }
            if (this.token.kind == TK_NONE_LITERAL) {
                return 'undefined'
            }
            throw `Unexpected token kind ${this.token.kind}`
        }
    }
}

function TupleExpr(tuple) {
    return {
        tuple: tuple
    }
}

function NumberLiteralExpr(value, loc) {
    return LiteralExpr(Token(TK_NUMBER_LITERAL, value, loc))
}

function VariableExpr(variable) {
    return {
        variable,
        toJavaScript: function() {
            return getJavaScriptVarName(this.variable)
        }
    }
}

function ParenExpr(expr) {
    return {
        expr,
        toJavaScript: function() {
            return `(${this.expr.toJavaScript()})`
        }
    }
}

function CallExpr(func, args) {
    return {
        func,
        args,
        toJavaScript: function() {
            return `${getJavaScriptVarName(this.func)}(${
                this.args.map((arg) => {
                    return arg.toJavaScript()
                }).join(',')
            })`
        }
    }
}

function NewObjectExpr(class_id, args) {
    return {
        class_id,
        args,
        toJavaScript: function() {
            return `new ${getJavaScriptVarName(this.class_id.value)}(${this.args.map(arg => arg.toJavaScript()).join(',')})`
        }
    }
}

function ListExpr(exprs) {
    return {
        exprs,
        toJavaScript: function() {
          return `[${
              this.exprs.map((expr) => {
                  return expr.toJavaScript()
              }).join(',')
          }]`
        }
    }
}

// Maps a dongbei comparison keyword to the Python version.
const COMPARISON_KEYWORD_TO_PYTHON = {};
COMPARISON_KEYWORD_TO_PYTHON[KW_GREATER] = '>';
COMPARISON_KEYWORD_TO_PYTHON[KW_LESS] = '<';
COMPARISON_KEYWORD_TO_PYTHON[KW_EQUAL] = '==';
COMPARISON_KEYWORD_TO_PYTHON[KW_NOT_EQUAL] = '!=';

function ComparisonExpr(op1, relation, op2) {
    return {
        op1: op1,
        relation: relation,
        op2: op2,
        toJavaScript: function() {
          if (this.relation.value === KW_IS_NONE) {
              return `${this.op1.toJavaScript()} === undefined`
          }
          return `${this.op1.toJavaScript()} ${COMPARISON_KEYWORD_TO_PYTHON[this.relation.value]} ${this.op2.toJavaScript()}`
        }
    }
}

function LengthExpr(expr) {
    return {
        expr,
        toJavaScript: function() {
            return `${this.expr.toJavaScript()}.length`
        }
    }
}

function NegateExpr(expr) {
    return {
        expr,
        toJavaScript: function() {
          return `-(${this.expr.toJavaScript()})`
        }
    }
}

function SubListExpr(list, remove_at_head, remove_at_tail) {
    return {
        list,
        remove_at_head,
        remove_at_tail,
        toJavaScript: function() {
            if (this.remove_at_head) {
                return `${this.list.toJavaScript()}.shift()`
            }
            if (this.remove_at_tail) {
                return `${this.list.toJavaScript()}.pop()`
            }
            return `${this.list.toJavaScript()}`
        }
    }
}

function IndexExpr(list_expr, index_expr) {
    return {
        list_expr: list_expr,
        index_expr: index_expr,
        toJavaScript: function() {
          let list_expr_js = this.list_expr.toJavaScript()
          let index_expr_js = this.index_expr.toJavaScript()
          let index_str = `(${index_expr_js} - 1) < 0 ? (${index_expr_js} - 1 + ${list_expr_js}.length) : (${index_expr_js} - 1)`
          return `${list_expr_js}[${index_str}]`
        }
    }
}

function ObjectPropertyExpr(object, property) {
    return {
        object,
        property,
        toJavaScript: function() {
            let obj = this.object.toJavaScript()
            let prop = getJavaScriptVarName(this.property.value)
            return `${obj}.${prop}`
        }
    }
}

function MethodCallExpr(object, call_expr) {
    return {
        object,
        call_expr,
        toJavaScript: function() {
            let obj = this.object.toJavaScript()
            let call = this.call_expr.toJavaScript()
            return `${obj}.${call}`
        }
    }
}

function Statement(kind, value) {
    return {
        kind: kind,
        value: value
    }
}

function Keyword(str, loc) {
    return Token(TK_KEYWORD, str, loc)
}

const CHINESE_DIGITS = {
    '鸭蛋': 0,
    '零': 0,
    '一': 1,
    '二': 2,
    '俩': 2,
    '两': 2,
    '三': 3,
    '仨': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9,
    '十': 10,
};

function TryParseNumber(str) {
    let m = str.match(/^(-?[0-9]+(\.[0-9]*)?)(.*)/);
    if (m) {
        let number_str = m[1]
        let remainder = m[3]
        if (number_str.indexOf('.') !== -1) {
            return [parseFloat(number_str), remainder];
        }
        return [parseInt(number_str), remainder];
    }

    for (let chinese_digit in CHINESE_DIGITS) {
        if (str.startsWith(chinese_digit)) {
            return [CHINESE_DIGITS[chinese_digit], str[chinese_digit.length]];
        }
    }

    return [, str];
}

function TokenizeStrContainingNoKeyword(chars, loc) {
    let tokens = [];
    let [number, rest] = TryParseNumber(chars);
    if (number !== undefined) {
        tokens.push(Token(TK_NUMBER_LITERAL, number, loc))
    }
    if (rest) {
        tokens.push(IdentifierToken(rest, loc))
    }
    return tokens;
}

class DongbeiParser {
    constructor() {
        this.code_loc = new SourceCodeAndLoc();
        this.tokens = [];
    }
    get code() {
        return this.code_loc.code
    }
    get loc() {
        return this.code_loc.loc;
    }
    tokenizeStringLiteralAndRest() {
        let tokens = [];
        let loc = this.loc.clone();
        let close_quote_pos = this.code.indexOf(KW_CLOSE_QUOTE);
        if (close_quote_pos < 0) {
            tokens.push(Token(TK_NON_TERMINATING_STRING_LITERAL, this.code, loc));
            this.skipChars(this.code.length);
            return tokens;
        }
        tokens.push(Token(TK_STRING_LITERAL, this.code.substring(0, close_quote_pos), loc))
        this.skipChars(close_quote_pos)
        tokens.push(Keyword(KW_CLOSE_QUOTE, this.loc))
        this.skipChars(KW_CLOSE_QUOTE.length);
        return tokens.concat(this.basicTokenize());
    }
    tryParseKeyword(keyword) {
        let orig_code_loc = this.code_loc.clone();
        for (let i in keyword) {
            let char = keyword.charAt(i);
            this.skipWhitespaceAndComment()
            if (!this.code.startsWith(char)) {
                this.code_loc = orig_code_loc
                return;
            }
            this.skipChar();
        }
        return keyword;
    }
    basicTokenize() {
        let tokens = [];
        this.skipWhitespaceAndComment();

        if (!this.code) {
            return tokens
        }

        let m = this.code.match(/^(【(.*?)】)/);
        if (m) {
            let id = m[2].replace(/\s+/g, '');
            tokens.push(IdentifierToken(id, this.loc));
            this.skipChars(m[1].length);
            return tokens.concat(this.basicTokenize());
        }

        for (let keyword of KEYWORDS) {
            let kw_loc = this.loc;
            let kw = this.tryParseKeyword(keyword);
            let remaining_code = this.code_loc.clone();
            if (kw) {
                keyword = KEYWORD_TO_NORMALIZED_KEYWORD[keyword] ? KEYWORD_TO_NORMALIZED_KEYWORD[keyword] : keyword;
                let last_token = Keyword(keyword, kw_loc);
                tokens.push(last_token);
                if (last_token.kind == TK_KEYWORD && last_token.value == KW_OPEN_QUOTE) {
                    this.code_loc = remaining_code;
                    return tokens.concat(this.tokenizeStringLiteralAndRest());
                }
                this.code_loc = remaining_code;
                this.skipWhitespace();
                return tokens.concat(this.basicTokenize());
            }
        }
        tokens.push(Token(TK_CHAR, this.code[0], this.loc));
        this.skipChar();
        return tokens.concat(this.basicTokenize());
    }
    tokenize(code, srcFilePath) {
        this.code_loc.code = code;
        this.code_loc.loc = new SourceLoc(srcFilePath);
        return this._tokenize();
    }
    _tokenize() {
        let tokens = [];
        let last_token = Token();
        let loc = this.loc.clone();
        let chars = '';

        for (let token of this.basicTokenize()) {
            let last_last_token = last_token;
            last_token = token;
            if (token.kind == TK_CHAR) {
                if (last_last_token.kind == TK_CHAR) {
                    chars += token.value
                    continue
                } else {
                    chars = token.value
                    continue
                }
            } else {
                if (last_last_token.kind == TK_CHAR) {
                    tokens.push.apply(tokens, TokenizeStrContainingNoKeyword(chars, loc));
                }
                tokens.push(token)
                chars = ''
            }
        }

        return tokens.concat(TokenizeStrContainingNoKeyword(chars, loc));
    }
    skipChar() {
        this.code_loc.skipChar();
    }
    skipChars(num) {
        for (let i = 0; i < num; i++) {
            this.skipChar()
        }
    }
    skipWhitespace() {
        if (this.code && this.code[0].trim() === '') {
            this.skipChar();
            return true;
        }
        return false;
    }
    skipLine() {
        while (this.code && this.code[0] != '\n') {
            this.skipChar();
        }
        if (this.code && this.code[0] == '\n') {
            this.skipChar();
        }
    }
    skipWhitespaceAndComment() {
        while (true) {
            let old_loc = this.loc.clone();
            while (this.skipWhitespace()) {}
            if (this.code.startsWith('#')) {
                this.skipLine();
            }
            if (this.loc.equal(old_loc)) {
                return
            }
        }
    }
    translateTokensToAst(tokens) {
        this.tokens = tokens;
        let statements = this.parseStmts();
        return statements
    }
    parseStmts() {
        let stmts = [];
        while (true) {
            let stmt = this.tryParseStmt();
            if (!stmt) {
                return stmts;
            }
            stmts.push(stmt);
        }
    }
    tryParseStmt() {
        let orig_tokens = this.tokens;

        // Parse 翠花，上
        let imp = this.tryConsumeKeyword(KW_IMPORT)
        if (imp) {
            let module = this.consumeTokenType(TK_IDENTIFIER)
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_IMPORT, module);
        }

        // Parse 开整：
        let begin = this.tryConsumeKeyword(KW_BEGIN)
        if (begin) {
            let stmts = this.parseStmts();
            if (!stmts) {
                stmts = []
            }
            this.consumeKeyword(KW_END)
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_COMPOUND, stmts)
        }

        // Parse 保准
        let assert_ = this.tryConsumeKeyword(KW_ASSERT)
        if (assert_) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_ASSERT, expr)
        }

        // Parse 辟谣
        assert_ = this.tryConsumeKeyword(KW_ASSERT_FALSE)
        if (assert_) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_ASSERT_FALSE, expr)
        }
    
        // Parse 整叉劈了
        let raise_ = this.tryConsumeKeyword(KW_RAISE)
        if (raise_) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_RAISE, expr)
        }

        // Parse 削：
        let set_none = this.tryConsumeKeyword(KW_SET_NONE)
        if (set_none) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_SET_NONE, expr)
        }
    
        // Parse 炮决：
        let del_ = this.tryConsumeKeyword(KW_DEL)
        if (del_) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_DEL, expr)
        }

        // Parse 唠唠：
        let say = this.tryConsumeKeyword(KW_SAY)
        if (say) {
            this.consumeKeyword(KW_COLON)
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_SAY, expr)
        }

        // Parse 整
        let call_expr = this.tryParseCallExpr()
        if (call_expr) {
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_CALL, call_expr)
        }
    
        // Parse 滚犊子吧
        let ret = this.tryConsumeKeyword(KW_RETURN)
        if (ret) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_RETURN, expr)
        }

        // Parse 接着磨叽
        let cont = this.tryConsumeKeyword(KW_CONTINUE)
        if (cont) {
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_CONTINUE)
        }
    
        // Parse 尥蹶子
        let break_ = this.tryConsumeKeyword(KW_BREAK)
        if (break_) {
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_BREAK)
        }

        // Parse 寻思
        let check = this.tryConsumeKeyword(KW_CHECK)
        if (check) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_THEN)
            let then_stmt = this.parseStmt()
            // Parse the optional else-branch.
            let kw_else = this.tryConsumeKeyword(KW_ELSE)
            let else_stmt
            if (kw_else) {
                else_stmt = this.parseStmt()
            } else {
                else_stmt = undefined
            }
            return Statement(STMT_CONDITIONAL, [expr, then_stmt, else_stmt]);
        }

        let func_def = this.tryParseFuncDef()
        if (func_def) {
            return func_def
        }

        // Parse an identifier name.
        let id = this.tryConsumeTokenType(TK_IDENTIFIER)
        if (id) {
            // Code below is for statements that start with an identifier.

            // Parse 是活雷锋
            let is_var = this.tryConsumeKeyword(KW_IS_VAR)
            if (is_var) {
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_VAR_DECL, id)
            }
      
            // Parse 都是活雷锋
            let is_list = this.tryConsumeKeyword(KW_IS_LIST)
            if (is_list) {
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_LIST_VAR_DECL, id)
            }
      
            // Parse 阶级
            let class_ = this.tryConsumeKeyword(KW_CLASS)
            if (class_) {
                this.consumeKeyword(KW_DERIVED)
                let subclass = this.consumeTokenType(TK_IDENTIFIER)
                this.consumeKeyword(KW_CLASS)
                this.consumeKeyword(KW_DEF)
                let methods = this.parseMethodDefs()
                this.consumeKeyword(KW_END)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_CLASS_DEF, [subclass, id, methods])
            }
        }

        this.tokens = orig_tokens
        let expr1 = this.tryParseExpr()
        if (expr1) {
            // Code below is fof statements that start with an expression.
    
            // Parse 从...到...磨叽
            let from_ = this.tryConsumeKeyword(KW_FROM)
            if (from_) {
                let from_expr = this.parseExpr()
                this.consumeKeyword(KW_TO)
                let to_expr = this.parseExpr()
                this.consumeKeyword(KW_LOOP)
                let stmts = this.parseStmts()
                this.consumeKeyword(KW_END_LOOP)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_LOOP, [expr1, from_expr, to_expr, stmts])
            }

            // Parse 在...磨叽
            let in_ = this.tryConsumeKeyword(KW_IN)
            if (in_) {
                let range_expr = this.parseExpr()
                this.consumeKeyword(KW_LOOP)
                let stmts = this.parseStmts()
                this.consumeKeyword(KW_END_LOOP)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_RANGE_LOOP, [expr1, range_expr, stmts])
            }

            // Parse 从一而终磨叽 or the '1 Infinite Loop' 彩蛋
            let infinite_loop = this.tryConsumeKeyword(KW_1_INFINITE_LOOP)
            if (!infinite_loop) {
                infinite_loop = this.tryConsumeKeyword(KW_1_INFINITE_LOOP_EGG)
            }
            if (infinite_loop) {
                let stmts = this.parseStmts()
                this.consumeKeyword(KW_END_LOOP)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_INFINITE_LOOP, [expr1, stmts])
            }

            // Parse 装
            let become = this.tryConsumeKeyword(KW_BECOME)
            if (become) {
                let expr = this.parseExpr()
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_ASSIGN, [expr1, expr])
            }
      
            // Parse 来了个
            let append = this.tryConsumeKeyword(KW_APPEND)
            if (append) {
                let expr = this.parseExpr()
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_APPEND, [expr1, expr])
            }
      
            // Parse 来了群
            let extend = this.tryConsumeKeyword(KW_EXTEND)
            if (extend) {
                let expr = this.parseExpr()
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_EXTEND, [expr1, expr])
            }

            // Parse 走走
            let inc_loc = this.loc
            let inc = this.tryConsumeKeyword(KW_INC)
            if (inc) {
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_INC_BY, [expr1, NumberLiteralExpr(1, inc_loc)])
            }

            // Parse 走X步
            inc = this.tryConsumeKeyword(KW_INC_BY)
            if (inc) {
                let expr = this.parseExpr()
                this.consumeKeyword(KW_STEP)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_INC_BY, [expr1, expr])
            }
      
            // Parse 稍稍
            let dec_loc = this.loc
            let dec = this.tryConsumeKeyword(KW_DEC)
            if (dec) {
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_DEC_BY, [expr1, NumberLiteralExpr(1, dec_loc)])
            }

            // Parse 稍X步
            dec = this.tryConsumeKeyword(KW_DEC_BY)
            if (dec) {
                let expr = this.parseExpr()
                this.consumeKeyword(KW_STEP)
                this.consumeKeyword(KW_PERIOD)
                return Statement(STMT_DEC_BY, [expr1, expr])
            }
      
            // Treat the expression as a statement.
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_EXPR, expr1)
        }

        this.tokens = orig_tokens
        return
    }
    tryParseObjectExpr() {
        // Do we see 抱团？
        let tuple = this.tryConsumeKeyword(KW_TUPLE)
        if (tuple) {
            return TupleExpr([])
        }
        
        // Do we see a number literal?
        let num = this.tryConsumeTokenType(TK_NUMBER_LITERAL)
        if (num) {
            return LiteralExpr(num)
        }
    
        // Do we see a None literal?
        let is_none_loc = this.loc.clone()
        let is_none = this.tryConsumeKeyword(KW_IS_NONE)
        if (is_none) {
            return LiteralExpr(Token(TK_NONE_LITERAL, undefined, is_none_loc))
        }

        // Do we see a string literal?
        let open_quote = this.tryConsumeKeyword(KW_OPEN_QUOTE)
        if (open_quote) {
            let str = this.consumeTokenType(TK_STRING_LITERAL)
            this.consumeKeyword(KW_CLOSE_QUOTE)
            return LiteralExpr(str)
        }

        // Do we see an identifier?
        let id = this.tryConsumeTokenType(TK_IDENTIFIER)
        if (id) {
            let new_obj = this.tryConsumeKeyword(KW_NEW_OBJECT_OF)
            if (!new_obj) {
                return VariableExpr(id.value)
            }
            let args = []
            let open_paren = this.tryConsumeKeyword(KW_OPEN_PAREN)
            if (open_paren) {
                args = this.parseExprList()
                this.consumeKeyword(KW_CLOSE_PAREN)
            }
            return NewObjectExpr(id, args)
        }

        // Do we see a parenthesis?
        let open_paren = this.tryConsumeKeyword(KW_OPEN_PAREN)
        if (open_paren) {
            let expr = this.parseExpr()
            this.consumeKeyword(KW_CLOSE_PAREN)
            return ParenExpr(expr)
        }
    
        // Do we see a function call?
        let call_expr = this.tryParseCallExpr()
        if (call_expr) {
            return call_expr
        }
        
        // Do we see a list literal?
        let open_bracket = this.tryConsumeKeyword(KW_OPEN_BRACKET)
        if (open_bracket) {
            let exprs = this.parseExprList()
            this.consumeKeyword(KW_CLOSE_BRACKET)
            return ListExpr(exprs)
        }
    
        return;
    }
    tryParseAtomicExpr() {
        let negate = this.tryConsumeKeyword(KW_NEGATE)
        if (negate) {
            let expr = this.tryParseAtomicExpr()
            return NegateExpr(expr)
        }

        let obj = this.tryParseObjectExpr()
        if (!obj) {
            return
        }

        let expr = obj
        while (true) {
            let pre_index_tokens = this.tokens

            // Parse 的老大
            let index1_loc = this.loc
            let index1 = this.tryConsumeKeyword(KW_INDEX_1)
            if (index1) {
                // dongbei 数组是从1开始的。
                expr = IndexExpr(expr, NumberLiteralExpr(1, index1_loc))
                continue
            }

            // Parse 的老幺
            let index_last_loc = this.loc
            let index_last = this.tryConsumeKeyword(KW_INDEX_LAST)
            if (index_last) {
                // 0 - 1 = -1
                expr = IndexExpr(expr, NumberLiteralExpr(0, index_last_loc))
                continue
            }

            // Parse 的老
            let index = this.tryConsumeKeyword(KW_INDEX)
            if (index) {
                // Parse an ObjectExpr.
                obj = this.tryParseObjectExpr()
                if (obj) {
                    expr = IndexExpr(expr, obj)
                    continue
                } else {
                    // We have a trailing 的老 without an object expression to follow it.
                    this.tokens = pre_index_tokens
                    break
                }
            }

            // Parse 的
            let dot = this.tryConsumeKeyword(KW_DOT)
            if (dot) {
                let property_ = this.consumeTokenType(TK_IDENTIFIER)
                expr = ObjectPropertyExpr(expr, property_)
                continue
            }
      
            // Parse method call.
            let call = this.tryParseCallExpr()
            if (call) {
                expr = MethodCallExpr(expr, call)
                continue
            }

            // Parse 有几个坑
            let length = this.tryConsumeKeyword(KW_LENGTH)
            if (length) {
                expr = LengthExpr(expr)
                continue
            }
      
            // Parse 掐头
            let remove_head = this.tryConsumeKeyword(KW_REMOVE_HEAD)
            if (remove_head) {
                expr = SubListExpr(expr, 1, undefined)
                continue
            }

            // Parse 去尾
            let remove_tail = this.tryConsumeKeyword(KW_REMOVE_TAIL)
            if (remove_tail) {
                expr = SubListExpr(expr, undefined, 1)
                continue
            }
            
            // Found neither 的老 or 有几个坑 after the expression.
            break
        }

        return expr
    }
    tryParseTermExpr() {
        let factor = this.tryParseAtomicExpr()
        if (!factor) {
            return
        }

        let factors = [factor]
        let operators = []

        while (true) {
            let pre_operator_tokens = this.tokens
            let operator = this.tryConsumeKeyword(KW_TIMES)
            if (!operator) {
              operator = this.tryConsumeKeyword(KW_DIVIDE_BY)
            }
            if (!operator) {
              operator = this.tryConsumeKeyword(KW_INTEGER_DIVIDE_BY)
            }
            if (!operator) {
              operator = this.tryConsumeKeyword(KW_MODULO)
            }
            if (!operator) {
              break
            }

            let factor = this.tryParseAtomicExpr()
            if (factor) {
                operators.push(operator)
                factors.push(factor)
            } else {
                this.tokens = pre_operator_tokens
                break
            }
        }
 
        let expr = factors[0]
        for (let i in operators) {
            expr = ArithmeticExpr(expr, operators[i], factors[Number(i) + 1])
        }
        return expr
    }
    tryParseArithmeticExpr() {
        let term = this.tryParseTermExpr()
        if (!term) {
            return
        }

        let terms = [term]
        let operators = []

        while (true) {
            let pre_operator_tokens = this.tokens
            let operator = this.tryConsumeKeyword(KW_PLUS)
            if (!operator) {
                operator = this.tryConsumeKeyword(KW_MINUS)
            }
            if (!operator) {
                break;
            }
            let term = this.tryParseTermExpr()
            if (term) {
                operators.push(operator)
                terms.push(term)
            } else {
                this.tokens = pre_operator_tokens
                break
            }
        }

        let expr = terms[0]
        for (let i in operators) {
            expr = ArithmeticExpr(expr, operators[i], terms[Number(i) + 1])
        }
        return expr
    }
    tryParseCallExpr() {
        let call = this.tryConsumeKeyword(KW_CALL)
        if (!call) {
            return
        }

        let base_init = this.tryConsumeKeyword(KW_BASE_INIT)
        let func_name;
        if (base_init) {
            func_name = 'super'
        } else {
            let func = this.consumeTokenType(TK_IDENTIFIER)
            func_name = func.value
        }

        let open_paren = this.tryConsumeKeyword(KW_OPEN_PAREN)
        let args = []
        if (open_paren) {
            args = this.parseExprList()
            this.consumeKeyword(KW_CLOSE_PAREN)
        }

        return CallExpr(func_name, args)
    }
    tryParseTupleExpr() {
        let orig_tokens = this.tokens
        let expr = this.tryParseCompOrArithExpr()
        if (!expr) {
            this.tokens = orig_tokens
            return
        }

        // Do we see 抱团?
        let tuple = this.tryConsumeKeyword(KW_TUPLE)
        if (tuple) {
            return TupleExpr([expr, ])
        }
    
        // Do we see 跟？
        let and_ = this.tryConsumeKeyword(KW_COMPARE_WITH)
        if (and_) {
            let rest_of_tuple = this.tryParseTupleExpr()
            if (rest_of_tuple) {
                return TupleExpr([expr, rest_of_tuple.tuple])
            }
        }
        this.tokens = orig_tokens
        return
    }
    tryParseNonConcatExpr() {
        let tuple = this.tryParseTupleExpr()
        if (tuple) {
            return tuple;
        }
        let expr = this.tryParseCompOrArithExpr()
        return expr
    }
    tryParseExpr() {
        let nc_expr = this.tryParseNonConcatExpr()
        if (!nc_expr) {
            return;
        }
        let nc_exprs = [nc_expr]
        while (true) {
            let pre_operator_tokens = this.tokens
            let concat = this.tryConsumeKeyword(KW_CONCAT)
            if (!concat) {
                break;
            }
            nc_expr = this.tryParseNonConcatExpr()
            if (nc_expr) {
                nc_exprs.push(nc_expr)
            } else {
                this.tokens = pre_operator_tokens
                break
            }
        }
        if (nc_exprs.length === 1) {
            return nc_exprs[0]
        }
        return ConcatExpr(nc_exprs)
    }
    parseExpr() {
        let expr = this.tryParseExpr()
        return expr
    }
    tryParseCompOrArithExpr() {
        let arith = this.tryParseArithmeticExpr()
        if (!arith) {
            return
        }
        let post_arith_tokens = this.tokens

        let cmp = this.tryConsumeKeyword(KW_COMPARE)
        if (cmp) {
            let arith2 = this.parseArithmeticExpr()
            let relation = this.tryConsumeKeyword(KW_GREATER)
            if (!relation) {
                relation = this.consumeKeyword(KW_LESS)
            }
            return ComparisonExpr(arith, relation, arith2)
        }

        cmp = this.tryConsumeKeyword(KW_COMPARE_WITH)
        if (cmp) {
            let arith2 = this.tryParseArithmeticExpr()
            if (!arith2) {
                this.tokens = post_arith_tokens
                return arith
            }
            let relation = this.tryConsumeKeyword(KW_EQUAL)
            if (!relation) {
                relation = this.tryConsumeKeyword(KW_NOT_EQUAL)
                if (!relation) {
                    this.tokens = post_arith_tokens
                    return arith
                }
            }
            return ComparisonExpr(arith, relation, arith2)
        }

        let cmp_loc = this.loc
        cmp = this.tryConsumeKeyword(KW_IS_NONE)
        if (cmp) {
            return ComparisonExpr(arith, Keyword(KW_IS_NONE, cmp_loc))
        }
    
        return arith
    }
    parseArithmeticExpr() {
        let expr = this.tryParseArithmeticExpr()
        return expr
    }
    tryParseFuncDef(is_method = false) {
        let orig_tokens = this.tokens
        let id = this.tryConsumeTokenType(TK_IDENTIFIER)
        if (!id) {
            return
        }

        let open_paren = this.tryConsumeKeyword(KW_OPEN_PAREN)
        let params = is_method ? [IdentifierToken(ID_SELF, this.loc)] : []
        if (open_paren) {
            while (true) {
                let param = this.consumeTokenType(TK_IDENTIFIER)
                params.push(param)
                let close_paren = this.tryConsumeKeyword(KW_CLOSE_PAREN)
                if (close_paren) {
                    break
                }
                this.consumeKeyword(KW_COMMA)
            }

            let func_def = this.consumeToken(Keyword(KW_DEF))
            let stmts = this.parseStmts()
            this.consumeKeyword(KW_END)
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_FUNC_DEF, [id, params, stmts])
        }

        // not open_paren
        let func_def = this.tryConsumeKeyword(KW_DEF)
        if (func_def) {
            let stmts = this.parseStmts()
            this.consumeKeyword(KW_END)
            this.consumeKeyword(KW_PERIOD)
            return Statement(STMT_FUNC_DEF, [id, params, stmts])
        }
    
        this.tokens = orig_tokens
        return
    }
    parseMethodDefs() {
        let methods = []
        while (true) {
            let method = this.tryParseFuncDef(true)
            if (method) {
                methods.push(method)
            } else {
                return methods
            }
        }
    }
    tryConsumeKeyword(keyword) {
        return this.tryConsumeToken(Keyword(keyword))
    }
    parseStmt() {
        let stmt = this.tryParseStmt()
        return stmt
    }
    tryConsumeTokenType(tk_type) {
        if (this.tokens.length === 0) {
            return;
        }
        if (this.tokens[0].kind == tk_type) {
            let token = this.tokens[0]
            this.tokens = this.tokens.slice(1);
            return token
        }
        return;
    }
    consumeTokenType(tk_type) {
        let tk = this.tryConsumeTokenType(tk_type);

        if (tk === undefined) {
            console.log('%s: 期望 %s，实际是 %s', this.tokens[0].loc, tk_type, this.tokens[0]);
            process.exit();
        }

        return tk
    }
    tryConsumeToken(token) {
        if (this.tokens.length === 0) {
            return;
        }
        if (!token.equal(this.tokens[0])) {
            return
        }
        this.tokens = this.tokens.slice(1);
        return token
    }
    consumeToken(token) {
        if (this.tokens.length === 0) {
            console.log('语句结束太早。');
            process.exit();
        }
        if (!token.equal(this.tokens[0])) {
            console.log(`line: ${this.tokens[0].loc.line}, column: ${this.tokens[0].loc.column}`)
            console.log(`期望符号 “${token.value}”, 实际却是 “${this.tokens[0].value}”`)
            process.exit();
        }
        let found_token = this.tokens[0]
        this.tokens = this.tokens.slice(1)
        return found_token
    }
    consumeKeyword(keyword) {
        return this.consumeToken(Keyword(keyword))
    }
    parseExprList() {
        let exprs = []
        let tokens_after_expr_list = this.tokens
        while (true) {
            let expr = this.tryParseExpr()
            tokens_after_expr_list = this.tokens
            if (expr) {
                exprs.push(expr)
            } else {
                // Couldn't parse an expression.
                this.tokens = tokens_after_expr_list
                return exprs
            }
            this.tokens = tokens_after_expr_list
            let comma = this.tryConsumeKeyword(KW_COMMA)
            if (!comma) {
                this.tokens = tokens_after_expr_list
                return exprs
            }
        }
    }

}

const ID_ARGV = '最高指示'
const ID_INIT = '新对象'
const ID_SELF = '俺'
const ID_YOU_SAY = '你吱声'
const ID_TRUE = '没毛病'
const ID_FALSE = '有毛病'
const ID_SLEEP = '打个盹'

// Maps a dongbei identifier to its corresponding Python identifier.
const _dongbei_var_to_js_var = {};
_dongbei_var_to_js_var[ID_ARGV] = 'process.argv';
_dongbei_var_to_js_var[ID_INIT] = 'constructor';
_dongbei_var_to_js_var[ID_SELF] = 'this';
_dongbei_var_to_js_var[ID_YOU_SAY] = 'readlineSync.question';
_dongbei_var_to_js_var[ID_TRUE] = 'true';
_dongbei_var_to_js_var[ID_FALSE] = 'false';
_dongbei_var_to_js_var[ID_SLEEP] = 'time.sleep';

function getJavaScriptVarName(variable) {
  if (variable in _dongbei_var_to_js_var) {
    return _dongbei_var_to_js_var[variable]
  }
  return variable;
}

function translateStatementToJavaScript(stmt, indent = '') {
    if (stmt.kind == STMT_VAR_DECL) {
        let var_token = stmt.value
        let variable = getJavaScriptVarName(var_token.value)
        return indent + `var ${variable} = undefined;`
    }

    if (stmt.kind == STMT_LIST_VAR_DECL) {
        let var_token = stmt.value
        let variable = getJavaScriptVarName(var_token.value)
        return indent + `var ${variable} = [];`
    }

    if (stmt.kind == STMT_ASSIGN) {
        let [var_expr, expr] = stmt.value
        let var_js = var_expr.toJavaScript()
        if (var_js.indexOf('.')) {
            return indent + `${var_js} = ${expr.toJavaScript()};`
        }
        return indent + `var ${var_js} = ${expr.toJavaScript()};`
    }

    if (stmt.kind == STMT_APPEND) {
        let [var_expr, expr] = stmt.value
        return indent + `${var_expr.toJavaScript()}.push(${expr.toJavaScript()})`
    }

    if (stmt.kind == STMT_EXTEND) {
        let [var_expr, expr] = stmt.value
        return indent + `${var_expr.toJavaScript()}.push.apply(${var_expr.toJavaScript()}, ${expr.toJavaScript()})`
    }

    if (stmt.kind == STMT_SAY) {
        let expr = stmt.value
        return indent + `_dongbei_print(${expr.toJavaScript()});`
    }

    if (stmt.kind == STMT_INC_BY) {
        let [var_expr, expr] = stmt.value
        return indent + `${var_expr.toJavaScript()} += ${expr.toJavaScript()}`
    }

    if (stmt.kind == STMT_DEC_BY) {
        let [var_expr, expr] = stmt.value
        return indent + `${var_expr.toJavaScript()} -= ${expr.toJavaScript()}`
    }

    if (stmt.kind == STMT_LOOP) {
        let [var_expr, from_val, to_val, stmts] = stmt.value
        let loop = indent + `for (let ${var_expr.toJavaScript()} of range(${from_val.toJavaScript()}, ${to_val.toJavaScript()})) `
        loop += '{'
        for (let s in stmts) {
            loop += `${translateStatementToJavaScript(stmts[s], indent)}`
        }
        loop += '}'
        return loop
    }

    if (stmt.kind == STMT_RANGE_LOOP) {
        let [var_expr, range_expr, stmts] = stmt.value
        let loop = indent + `for (let ${var_expr.toJavaScript()} of ${range_expr.toJavaScript()}) `
        loop += '{'
        for (let s in stmts) {
            loop += `${translateStatementToJavaScript(stmts[s], indent)}`
        }
        loop += '}'
        return loop
    }

    if (stmt.kind == STMT_INFINITE_LOOP) {
        let [var_expr, stmts] = stmt.value
        let loop = indent + `for (let ${var_expr.toJavaScript()} of _dongbei_1_infinite_loop())`
        loop += '{'
        for (let s in stmts) {
            loop += `${translateStatementToJavaScript(stmts[s], indent)}`
        }
        loop += '}'
        return loop
    }

    if (stmt.kind == STMT_FUNC_DEF) {
        let [func_token, params, stmts] = stmt.value
        let func_name = getJavaScriptVarName(func_token.value)
        let param_names = params.map((tk) => {
            return getJavaScriptVarName(tk.value)
        })
        if (param_names[0] === 'this') {
            param_names.shift()
        }
        code = indent + `${func_name !== 'constructor' ? 'function ' : ''}${func_name}(${param_names.join(', ')}) `
        code += '{'
        for (let s in stmts) {
            code += `${translateStatementToJavaScript(stmts[s], indent)}`
        }
        code += '}'
        return code
    }

    if (stmt.kind == STMT_CALL) {
        let func = stmt.value.func
        let args = stmt.value.args
        let func_name = getJavaScriptVarName(func)
        let code = indent + `${func_name}(${args.map(arg => arg.toJavaScript()).join(',')});`
        return code
    }

    if (stmt.kind == STMT_RETURN) {
        return indent + 'return ' + stmt.value.toJavaScript()
    }

    if (stmt.kind == STMT_COMPOUND) {
        let code = indent
        let stmts = stmt.value
        if (stmts) {
            for (let s in stmts) {
                code += translateStatementToJavaScript(stmts[s], indent)
            }
        }
        return code
    }

    if (stmt.kind == STMT_CONDITIONAL) {
        let [condition, then_stmt, else_stmt] = stmt.value
        let code = indent + `if (${condition.toJavaScript()}) `
        code += `{${translateStatementToJavaScript(then_stmt, indent)}} `
        if (else_stmt) {
            code += `else {${translateStatementToJavaScript(else_stmt, indent)}}`
        }
        return code
    }

    if (stmt.kind == STMT_SET_NONE) {
        return indent + `${stmt.value.toJavaScript()} = undefined`
    }

    if (stmt.kind == STMT_DEL) {
        return indent + `delete ${stmt.value.toJavaScript()}`
    }

    if (stmt.kind == STMT_IMPORT) {
        return indent + `require("${stmt.value.value}")`
    }

    if (stmt.kind == STMT_BREAK) {
        return indent + 'break;'
    }

    if (stmt.kind == STMT_CONTINUE) {
        return indent + 'continue;'
    }

    // STMT_ASSERT

    // STMT_ASSERT_FALSE

    // STMT_RAISE

    // STMT_CLASS_DEF

    if (stmt.kind == STMT_CLASS_DEF) {
        let [subclass, baseclass, methods] = stmt.value
        let baseclass_decl = ''
        if (baseclass.value != '无产') {
            baseclass_decl = ` extends ${getJavaScriptVarName(baseclass.value)}`
        }
        code = indent + `class ${getJavaScriptVarName(subclass.value)}${baseclass_decl} `
        code += '{'
        for (let method in methods) {
            code += translateStatementToJavaScript(methods[method], indent)
        }
        code += '}'
        return code
    }

    if (stmt.kind == STMT_EXPR) {
        return indent + stmt.value.toJavaScript()
    }

    console.log(`俺不懂 ${stmt.kind} 语句咋执行。`)
    process.exit();
}

function translateDongbeiToJs(code, srcFilePath) {
    let js_code = [];
    let parser = new DongbeiParser();
    let tokens = parser.tokenize(code, srcFilePath);
    let statements = parser.translateTokensToAst(tokens);

    for (let s of statements) {
        js_code.push(translateStatementToJavaScript(s));
    }
    return js_code.join('\n');
}

function run(code, srcFilePath) {
    let jsCode = translateDongbeiToJs(code, srcFilePath);
    try {
        eval(jsCode);
    } catch (error) {
        _dongbei_print(`整叉劈了：${error.toString().split(':')[1]}`)
    }
}

function main() {
    let program = process.argv[2];
    if (program) {
        fs.readFile(program, 'utf-8', function (error, data) {
            if (error) {
                console.log(error);
            } else {
                run(data, program);
            }
        });
    } else {
        console.log('please input file path!');
    }
}

main();
