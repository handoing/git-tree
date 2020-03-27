const s0 = 's0';
const s1 = 's1';
const s2 = 's2';

const a = 'a';
const b = 'b';

function stateTransfer(state, char) {
  if (state === s0) {
    if (char === a) {
      return s1;
    }
    if (char === b) {
      return s2;
    }
    return;
  }

  if (state === s1) {
    if (char === a) {
      return s1;
    }
    if (char === b) {
      return s2;
    }
    return;
  }

  if (state === s2) {
    if (char === a) {
      return s2;
    }
    if (char === b) {
      return s1;
    }
    return;
  }

  return;
}

var dfa = {
  chars: '',
  currentState: s0,
  endState: s2,
  charsIsEmpty() {
    return this.chars.length === 0
  },
  isEndState() {
    return this.currentState === this.endState
  },
  match(str) {
    this.chars = str;
    while (true) {

      if (this.charsIsEmpty()) {
        return this.isEndState();
      }

      this.currentState = stateTransfer(this.currentState, this.chars[0]);
      this.chars = this.chars.substring(1);
    }
  }
};

console.log(dfa.match('aaaaab'))
