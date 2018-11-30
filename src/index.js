import { expect } from 'chai';
import * as myModule from './my-module';
import { myFun } from './my-module';
import * as allMyFun from './my-fun';
import defaultMyFun from './my-fun';

// Tests scenarios described in http://exploringjs.com/es6/ch_modules.html#sec_imports-as-views-on-exports
// 16.7.2 In ES6, imports are live read-only views on exported values

// Babel spec mode...
// http://2ality.com/2017/01/babel-esm-spec-mode.html

// Babel plugin-transform-es2015-modules-commonjs
// https://babeljs.io/docs/en/babel-plugin-transform-es2015-modules-commonjs

describe('es6 import/export implementation in babel', function () {
    it('cannot set a member of a module object - import * as foo (named export)', function () {
        // The properties of a module object foo (import * as foo from 'foo') are like the properties of a frozen object.
        expect(() => {
            myModule.myFun = function () {
                return 'changed';
            };
        }).to.throw('Cannot set property myFun of #<Object> which has only a getter');
        expect(myModule.myFun()).to.equal('unchanged');
    });

    it('cannot redefine the member of a module object - import * as foo (named export)', function () {
        // The properties of a module object foo (import * as foo from 'foo') are like the properties of a frozen object.
        expect(() => {
            Object.defineProperty(myModule, 'myFun', {
                get: function () {
                    return 'changed';
                }
            });
        }).to.throw('Cannot redefine property: myFun');

        expect(myModule.myFun()).to.equal('unchanged');
    });

    it('cannot reassign a named import - import { foo }', function () {
        // Unqualified imports (import x from 'foo') are like const-declared variables.
        expect(() => {
            myFun = function () {
                return 'changed';
            };
        }).to.throw('"myFun" is read-only.');

        expect(myFun()).to.equal('unchanged');
    });

    it('cannot set the named default export - import * as foo (default export)', function () {
        // The properties of a module object foo (import * as foo from 'foo') are like the properties of a frozen object.
        // The default export is just a named export named "default"
        expect(() => {
            allMyFun.default = function () {
                return 'changed';
            };
        }).to.throw();

        expect(allMyFun.default()).to.equal('unchanged');
    });

    it('cannot set unqualified imported symbol - import foo from ...', function () {
        // Unqualified imports (import x from 'foo') are like const-declared variables.
        expect(() => {
            defaultMyFun = function () {
                return 'changed';
            };
        }).to.throw('"defaultMyFun" is read-only.');

        // Fails because the named export 'default' was changed by previous test
        expect(defaultMyFun()).to.equal('unchanged');
    });
});
