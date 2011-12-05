/**
 * Created by JetBrains WebStorm.
 * User: murat.zengin
 * Date: 11/29/11
 * Time: 1:47 PM
 * Ajax method mentioned in this script can be
 * modified with following code to use jQuery

         $.ajax({
               async:false,
               url: "response.html",
               dataType: 'json',
               success: function(data){
                   $.each(data.bindings, function(key, obj){result.push(obj);})
               }
             });
 */
        var config = {
                maxSuggestion: 9,
                maxTags: 5
        };
        var MYAPP = {};
        MYAPP.dom = {};
        MYAPP.methods = {};
        MYAPP.dom.TextBox = function()
        {
            var element = document.createElement('input');
            element.type = 'text';
            element.placeholder = 'Type your tag here';
            element.id = 'tagBox';
            element.addEventListener('keyup', function(e){
                            var dummyList = MYAPP.methods.GetList();
                            MYAPP.methods.ClearChildren(MYAPP.dom.UL);
                            if(element.value.length > 0){
                                for(var a = 0; a < config.maxSuggestion; a++)
                                    {
                                        var spanBox =  new MYAPP.dom.SPAN();
                                        var aElement = MYAPP.dom.LINK(spanBox.id);

                                        // create a LI
                                        var liElement = new MYAPP.dom.LI(spanBox, element);
                                        liElement.appendChild(new MYAPP.dom.CustomDIV('suggestionBlockTagName', dummyList[a].tagName + " x " + dummyList[a].count));
                                        liElement.appendChild(new MYAPP.dom.CustomDIV('suggestionBlockTagDesc', dummyList[a].tagDesc));
                                        liElement.obj = dummyList[a];
                                        spanBox.innerHTML = liElement.obj.tagName;
                                        spanBox.appendChild(aElement);
                                        MYAPP.dom.UL.appendChild(liElement);
                                    }
                                }
                        }, false);
            return element;
        };

        MYAPP.dom.TagBoxDiv = document.getElementById('tagBoxDiv');

        MYAPP.dom.SuggestionBlock = function()
        {
            var element = document.createElement('div');
            element.className = "suggestionBlockClass";
            return element;
        };

        MYAPP.dom.UL = document.createElement('ul');

        MYAPP.dom.SPAN = function()
        {
            var element = document.createElement('span');
            var spanId = Math.random();
            element.id = spanId;
            element.setAttribute('id', spanId);
            return element;
        }

        MYAPP.dom.LI = function(newnode, oldnode)
        {
            var tagBoxDiv = MYAPP.dom.DIV();
            var element = document.createElement('li');
            element.className = 'nav';
            element.addEventListener('click', function(data){
                            MYAPP.methods.ClearChildren(MYAPP.dom.UL);
                            var spanBox =  new MYAPP.dom.SPAN();
                            var aElement = MYAPP.dom.LINK(spanBox.id);
                            spanBox.innerHTML = this.obj.tagName;
                            spanBox.appendChild(aElement);
                            oldnode.value = '';
                            MYAPP.dom.TagBoxDiv.childNodes.length-1 <= config.maxTags ?
                                tagBoxDiv.insertBefore(newnode, oldnode) :
                                null;
                        }, false);
            return element;
        };

        MYAPP.dom.CustomDIV = function(classname, textContext)
        {
            var element = document.createElement('div');
            element.className = classname;
            element.textContent = textContext;
            return element;
        }

        MYAPP.dom.DIV = function()
        {
            return document.getElementById('tagBoxDiv');
        }

        MYAPP.dom.LINK = function(id)
        {
            var element = document.createElement('a');
            element.href = 'javascript:void(0)';
            element.className = 'delete';
            element.addEventListener('click', function(){MYAPP.methods.ClearNode(id);}, false);
            return element;
        }

        MYAPP.methods.ClearChildren = function(element){
            // clear the li elements in ul
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

        MYAPP.methods.GetList = function()
        {
          var result = [];
          if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
          }
          else {
              xhr=new ActiveXObject("Microsoft.XMLHTTP");
          }

          if (xhr) {
              xhr.open("GET", 'response.html', false);
              xhr.send(null);

              var obj = JSON.parse(xhr.responseText);
              for(var d in obj.bindings) {
                  result.push(obj.bindings[d]);
              }
          }
          return result;
        }

        MYAPP.methods.ClearNode = function(source)
        {
            var tagBoxDiv = MYAPP.dom.DIV();
            var node = document.getElementById(source);
            tagBoxDiv.removeChild(node);
        }

        MYAPP.init = (function(){
             // Create main div that holds the tags
            var tagBoxDiv = MYAPP.dom.DIV();

            // Create SuggestionBlock
            var suggestionBlock = MYAPP.dom.SuggestionBlock();
            var tagBox = MYAPP.dom.TextBox();
            var ulElement = MYAPP.dom.UL;

            // add UL element to suggestionBlock
            suggestionBlock.appendChild(ulElement);
            var d = document.getElementById('tagBoxDiv');

            d.appendChild(tagBox);
            d.appendChild(suggestionBlock);
        })();

