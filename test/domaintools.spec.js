const expect = require("chai").expect;
const dom = require("./setup").jsdom;
const appendToParent = require("../scripts/domaintools").appendToParent;
describe('domaintools', () => {
    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
      }
    it('should append right text to the parent element', () => {
        var html='<div><span id="test_id"></span></div>';
        var parent=htmlToElement(html);
        dom.window.document.body.appendChild(parent);
        var id='#test_id';
        var item="test_item";
        var text_before="some_text_before ";
        var text_after=" some_text_after";
        var show_item=true;
        appendToParent(id,item,text_before,parent,show_item,text_after);
        expect(parent.firstChild.innerHTML).to.equal('some_text_before test_item some_text_after');
    });
});