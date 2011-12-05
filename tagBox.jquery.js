/**
 * Created by JetBrains WebStorm.
 * User: murat.zengin
 * Date: 12/2/11
 * Time: 1:22 PM
 * To change this template use File | Settings | File Templates.
 */
(function($){
 $.fn.tagBox = function(options) {

  var defaults = {
      maxSuggestion: 9,
      maxTags: 5,
      template: "<div class='suggestionBlockTagName'>${tagName}</div><div class='suggestionBlockTagDesc'>${tagDesc}</div>"
  };

  var config = $.extend(defaults, options);

  return this.each(function() {
        var obj = $(this);
          $.getScript('http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js', function() {

          });
        var MYAPP = {};
        MYAPP.dom = {};
        MYAPP.methods = {};
        MYAPP.dom.TextBox = function()
        {
            var element = $('<input>');
            element.type = 'text';
            element.attr('placeholder', 'Type your tag here');
            element.id = 'tagBox';
            element.bind('keyup', function(e){
                            var dummyList = MYAPP.methods.GetList();
                            MYAPP.dom.UL.empty();
                            if(element.val().length > 0){
                                for(var a = 0; a < config.maxSuggestion; a++)
                                    {
                                        var spanBox =  new MYAPP.dom.SPAN();
                                        var aElement = MYAPP.dom.LINK(spanBox.id);

                                        // create a LI
                                        var liElement = new MYAPP.dom.LI(spanBox, element);
                                        $.template("tagTemplate", config.template);
                                        $.tmpl("tagTemplate", dummyList[a]).appendTo(liElement);
                                        liElement.obj = dummyList[a];
                                        spanBox.html(liElement.obj.tagName);
                                        spanBox.append(aElement);
                                        MYAPP.dom.UL.append(liElement);
                                    }
                                }
                        }, false);
            return element;
        };

        MYAPP.dom.TagBoxDiv = $("#tagBoxDiv");// document.getElementById('tagBoxDiv');

        MYAPP.dom.SuggestionBlock = function()
        {
            var element = $('<div></div>');
            element.attr('className', 'suggestionBlockClass');
            return element;
        };

        MYAPP.dom.UL = $('<ul></ul>');

        MYAPP.dom.SPAN = function()
        {
            var element = $('<span></span>');
            var spanId = Math.random().toString().replace('.', '');
            element.id = spanId;
            element.attr('id', spanId);
            return element;
        }

        MYAPP.dom.LI = function(newnode, oldnode)
        {
            var tagBoxDiv = MYAPP.dom.DIV();
            var element = $('<li></li>');
            element.attr('className','nav');
            element.bind('click', function(data){
                            MYAPP.dom.UL.empty();
                            var spanBox =  new MYAPP.dom.SPAN();
                            var aElement = MYAPP.dom.LINK(spanBox.id);
                            spanBox.html(data.tagName);
                            spanBox.append(aElement);
                            oldnode.val('');
                            MYAPP.dom.TagBoxDiv.children().length-1 <= config.maxTags ?
                                newnode.insertBefore(oldnode) :
                                null;
                        });
            return element;
        };

        MYAPP.dom.CustomDIV = function(classname, textContext)
        {
            var element = $('<div></div>');
            element.attr('className', classname);
            element.html(textContext);
            return element;
        }

        MYAPP.dom.DIV = function()
        {
            return $("#tagBoxDiv");// document.getElementById('tagBoxDiv');
        }

        MYAPP.dom.LINK = function(id)
        {
            var element = $('<a></a>');
            element.attr('href','javascript:void(0)');
            element.attr('className','delete');
            element.bind('click', function(){MYAPP.methods.ClearNode(id);}, false);
            return element;
        }

        MYAPP.methods.GetList = function()
        {
          var result = [];
            $.ajax({
                   async:false,
                   url: "response.html",
                   dataType: 'json',
                   success: function(data){
                       $.each(data.bindings, function(key, obj){result.push(obj);})
                   }
                 });
          return result;
        }

        MYAPP.methods.ClearNode = function(source)
        {
            var tagBoxDiv = MYAPP.dom.DIV();
            var node = $("#" + source);// document.getElementById(source);
            tagBoxDiv.find('span#'+source).remove();
        }

        MYAPP.init = (function(){
             // Create main div that holds the tags
            var tagBoxDiv = MYAPP.dom.DIV();

            // Create SuggestionBlock
            var suggestionBlock = MYAPP.dom.SuggestionBlock();
            var tagBox = MYAPP.dom.TextBox();
            var ulElement = MYAPP.dom.UL;

            // add UL element to suggestionBlock
            suggestionBlock.append(ulElement);

            obj.append(tagBox);
            obj.append(suggestionBlock);
        })();


  });

 };
})(jQuery);
