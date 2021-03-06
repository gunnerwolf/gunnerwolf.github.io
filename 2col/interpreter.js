var code;
var output = "";
var input;

function cellHolder(cell, line) {
    this.value = cell;
    this.lineNum = line;
    if (isNaN(this.value)) this.value = 0;
    if (isNaN(this.lineNum)) this.value = 0;
}

function getValue(val) {
    if (typeof val === 'number') {
        return val;
    } else if (typeof val === 'string') {
        var parsed = parseInt(val);
        if (!isNaN(parsed)) {
            return parsed;
        } else {
            return val.charCodeAt(0);
        }
    } else {
        return 0;
    }
}

function getParam(valCode, lines, cell) {
	if (valCode === undefined) {
		return 0;
	} else if (valCode == 'v') {
        cell.lineNum += 1;
        return parseLine(lines, new cellHolder(cell.value, cell.lineNum));
    } else if (valCode == '^') {
        return parseLine(lines, new cellHolder(cell.value, cell.lineNum - 1));
    } else if (typeof valCode === 'int') {
        return valCode;
    } else {
        var parsed = parseInt(valCode);
        if (!isNaN(parsed)) {
            return parsed;
        } else {
            return valCode.charCodeAt(0);
        }
    }
}

function findEnd(lines) {
    forCount = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == 'Ed') {
            if (forCount > 0) {
                forCount--;
            } else {
                return {lines: lines.slice(0, x), endIndex: x + 1};
            }
        } else if (lines[x].startsWith('F') && lines[x] != 'F!') {
            forCount++;
        }
    }
}

function fact(x) {
    if(x==0) {
        return 1;
    }
    return x * fact(x-1);
}

function parseLine(lines, cell) {
    if (cell.lineNum < 0 || cell.lineNum >= lines.length) {
        return 0;
    }
    l = lines[cell.lineNum];
    if (l.includes(' ')) {
        l = l.trim();
    }

    if (l == 'Sq') {
        return ((cell.value**.5%1)==0);
    } else if (l == 'F!') {
        var val = [];
        for (var i = 0; i < cell.value; i++) {
            val.push(fact(i));
        }
        return val;
    } else if (l == "HW") {
        return "Hello, World!";
    } else if (l == "In") {
        return 0;
    } else if (l == "Ed") {
        return 0;
    } else if (l == "==") {
        return 0;
    } else if (l.startsWith('+')) {
        if (l.length > 1) {
            var val = getParam(l[1], lines, cell);
            cell.value += val;
        } else {
            cell.value += cell.value;
        }
    } else if (l.startsWith('-')) {
        if (l.length > 1) {
            var val = getParam(l[1], lines, cell);
            cell.value -= val;
        } else {
            cell.value -= cell.value;
        }
    } else if (l.startsWith('*')) {
        if (l.length > 1) {
            var val = getParam(l[1], lines, cell);
            cell.value *= val;
        } else {
            cell.value *= cell.value;
        }
    } else if (l.startsWith('/')) {
        if (l.length > 1) {
            var val = getParam(l[1], lines, cell);
            cell.value /= val;
        } else {
            cell.value /= cell.value;
        }
    } else if (l.startsWith('=')) {
        if (l.length > 1) {
            var val = getParam(l[1], lines, cell);
            cell.value = val;
        }
    } else if (l.startsWith('?')) {
        val = getParam(l[1], lines, cell);
        if (!val) {
            cell.lineNum += 1;
        }
    } else if (l.startsWith('!')) {
        val = getParam(l[1], lines, cell);
        if (val) {
            cell.lineNum += 1;
        }
    } else if (l.startsWith('$')) {
        val = getParam(l[1], lines, cell);
        return val.includes(cell.value);
    } else if (l.startsWith('#')) {
        if (l.length > 1) {
            val = getParam(l[1], lines, cell);
            output += val + "\n";
            return val;
        } else {
            output += cell.value + "\n";
        }
    } else if (l.startsWith('d')) {
        var val;
        if (l.length > 1) {
            val = getParam(l[1], lines, cell);
        } else {
            val = cell.value;
        }
        rand = (Math.floor(Math.random() * val)) + 1;
        output += rand + "\n";
        return rand;
    } else if (l.startsWith('D')) {
        var val;
        if (l.length > 1) {
            val = getParam(l[1], lines, cell);
        } else {
            val = cell.value;
        }
        var ret = Array(val).keys().reverse();
        return ret;
    } else if (l.startsWith('A')) {
        var val;
        if (l.length > 1) {
            val = getParam(l[1], lines, cell);
        } else {
            val = cell.value;
        }
        var ret = Array(val).keys();
        return ret;
    } else if (l.startsWith('F')) {
        var val;
        if (l.length > 1) {
            val = getParam(l[1], lines, cell);
        } else {
            val = cell.value;
        }
        end = findEnd(lines.slice(cell.lineNum + 1));
        if (val instanceof Array) {
            for (var i = 0; i < val.length; i++) {
                parse(end.lines, new cellHolder(i, 0));
            }
        } else {
            for (var i = 0; i < val; i++) {
                parse(end.lines, new cellHolder(i, 0));
            }
        }
        cell.lineNum += end.endIndex;
    } else if (l.startsWith('^')) {
        var val = parseLine(lines, new cellHolder(cell.value, cell.lineNum - 1));
        return val;
    } else if (l.startsWith('v')) {
        cell.lineNum++;
        var val = parseLine(lines, cell);
        return val;
    } else {
        var parsed = parseInt(l);
        if (!isNaN(parsed)) {
            return parsed;
        } else {
            return l.charCodeAt(0);
        }
    }

    return cell.value;
}

function parse(code, cell) {
    retval = 0;
    while (cell.lineNum < code.length) {
        retval = parseLine(code, cell);
        cell.lineNum++;
    }
    output += retval.toString();
}

function chunk(str, n) {
    var ret = [];
    var i;
    var len;
    for(i = 0, len = str.length; i < len; i += n) {
        ret.push(str.substr(i, n));
    }
    return ret;
}

function interpreter() {
    code = document.getElementById("code").value;
    mode = document.getElementById("mode").value;
    if (mode == "b") code = chunk(code, 2).join('\n');
    code = code.split('\n');
    for (var i = 0; i < code.length; i++) {
        if (code[i].length != 2) {
            output += "Invalid code!\n";
            output += "Line " + i + " contains invalid 2Col code!\n";
            output += code[i];
            document.getElementById("output").value = output;
            output = "";
            return;
        }
    }

    input = document.getElementById("input").value;

    var cell = new cellHolder(getValue(input), 0);

    parse(code, cell);

    document.getElementById("output").value = output;
    output = "";
}
