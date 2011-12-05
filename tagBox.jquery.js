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
      multipleOccurence: false,
      template: "<div class='suggestionBlockTagName'>${tagName}</div><div class='suggestionBlockTagDesc'>${tagDesc}</div>"
  };

  var config = $.extend(defaults, options);

  return this.each(function() {
        var obj = $(this);
        $.getScript('http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js');
        var validList = [];
        var MYAPP = {};
        MYAPP.dom = {};
        MYAPP.methods = {};
        MYAPP.dom.TextBox = function(){
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
                                        var spanBox =  new MYAPP.dom.SPAN(dummyList[a].id);
                                        spanBox.attr('id', dummyList[a].id);
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

        MYAPP.dom.HiddenInput = function(){
            var element = $('<input>');
            element.attr('type','hidden').attr('id', 'tagBoxHiddenInput').attr('value', '');
            return element;
        }

        MYAPP.dom.TagBoxDiv = $("#tagBoxDiv");

        MYAPP.dom.SuggestionBlock = function(){
            var element = $('<div></div>');
            element.attr('className', 'suggestionBlockClass');
            return element;
        };

        MYAPP.dom.UL = $('<ul></ul>');

        MYAPP.dom.SPAN = function(id){
            var element = $('<span></span>');
            element.id = id;
            element.attr('id', id);
            return element;
        }

        MYAPP.dom.LI = function(newnode, oldnode){
            var element = $('<li></li>');
            element.attr('className','nav');
            element.bind('click', function(data){
                            MYAPP.dom.UL.empty();
                            newnode.html(data.tagName);
                            oldnode.val('');
                            if(MYAPP.methods.IsValid(newnode.id)){
                                newnode.insertBefore(oldnode)
                            }
                        });
            return element;
        };

        MYAPP.methods.IsValid = function(source){
            var isValid = true;
            var hidden = $("#tagBoxHiddenInput");
            for(var a in validList){
                if(validList[a] == source)
                {
                    isValid = false;
                }
            }
            if(isValid) {
                validList.push(source)
                hidden.attr('value', validList.join());
            };

            return (isValid || config.multipleOccurence) &&
                MYAPP.dom.TagBoxDiv.find('span').length +1 <= config.maxTags;
        }

        MYAPP.dom.CustomDIV = function(classname, textContext){
            var element = $('<div></div>');
            element.attr('className', classname);
            element.html(textContext);
            return element;
        }

        MYAPP.dom.DIV = function(){
            return $("#tagBoxDiv");
        }

        MYAPP.dom.LINK = function(id){
            var element = $('<a></a>');
            element.attr('href','javascript:void(0)');
            element.attr('className','delete');
            element.bind('click', function(){MYAPP.methods.ClearNode(id);}, false);
            return element;
        }

        MYAPP.methods.GetList = function(){
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

        Array.prototype.remove = function(e) {
          var t, _ref;
          if ((t = this.indexOf(e)) > -1) {
              return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
          }
        };

        MYAPP.methods.ClearNode = function(source){
            var tagBoxDiv = MYAPP.dom.DIV();
            tagBoxDiv.find('span#'+source).remove();
            validList.remove(source);
        }

        MYAPP.init = (function(){
             // Create main div that holds the tags
            var tagBoxDiv = MYAPP.dom.DIV();

            // Create hidden input
            var hidden = new MYAPP.dom.HiddenInput();

            // Create SuggestionBlock
            var suggestionBlock = MYAPP.dom.SuggestionBlock();
            var tagBox = MYAPP.dom.TextBox();
            var ulElement = MYAPP.dom.UL;

            // add UL element to suggestionBlock
            suggestionBlock.append(ulElement);

            obj.append(tagBox);
            obj.append(hidden);
            obj.append(suggestionBlock);
        })();
  });
 };
})(jQuery);
