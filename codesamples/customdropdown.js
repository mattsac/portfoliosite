/**************************
	* New NI Custom Dropdown
	**************************/
var $selectedDropdown = $();
var $openedDropdown = $();
var $afterEditCallback;
var initDropdowns;
addToNamespace("NI.forms").initializeNIForm = function(afterEditCallback) {
		$afterEditCallback = afterEditCallback;
		initDropdowns = new initializeDropdowns(afterEditCallback);
};

var initializeDropdowns = function(bLazyLoadedContents) {
		$('.ni-custom-select').each(function() {

				var selectedOption = '-Select One -';
				var selectOptions = [];
				selectOptions = $('option', this).map(function() {
						if ($(this).attr('selected') === 'selected') {
								selectedOption = $(this).text();
						}

						var keyVal = {
								'key': $(this).text(),
								'value': $(this).val()
						};

						return keyVal;
				});



				var thisID = $(this).attr('id');
				var elementId = (typeof(thisID) !== 'undefined')?thisID:$(this).attr('name');
				
				var thisCallback = $(this).data('callback');

				var newHTMLContainer = '<div class="ni-custom-dropdown clearfix ' + $(this).attr('class') + '" tabindex="0">';
				newHTMLContainer += '<div id="' + elementId + 'Text" class="input-text">' + selectedOption + '</div>';
				newHTMLContainer += '<div class="ni-custom-select-icon"><span class="glyphicon glyphicon-menu-down"></span></div>';
				newHTMLContainer += '<div class="ni-custom-dropdown-contents"><ul class="ni-custom-dropdown-contents-border">';

				$.each(selectOptions, function(index, option) {
						newHTMLContainer += '<li onclick="NI.forms.setThisDropValue(\'' + elementId + '\',\'' + option.key + '\',\'' + option.value + '\',\'' + thisCallback + '\');">' + option.key + '</li>';
				});

				newHTMLContainer += '</ul></div>';
				if (NI.viewport.is('>sm')) {
						newHTMLContainer += '<input type="hidden" name="'+$(this).attr('name')+'" id="'+elementId+'" value="'+$(this).val()+'"/></div>';
				}
				newHTMLContainer += '</div>';

				//$(this).wrap('<div class="'+ $(this).attr('class') + '-parent"></div>');
				$(this).after(newHTMLContainer);
				$(this).attr('id',thisID);
				
				$('[id="'+elementId+'Text"]').dotdotdot({
              height: $(this).height(),
														wrap: 'letter',
              tollerance:0
            });

				$(this).change(function(event) {
						if (NI.viewport.is('<md')) {
								var eventTarget = $(event.target);
								var eventTargetElement = eventTarget[0];
								var eventTargetId = eventTargetElement.id;
								var nameOrId = (typeof(eventTargetId) !== 'undefined')?eventTargetId:eventTargetElement.name;
								NI.forms.setThisDropValue(nameOrId, eventTargetElement.selectedOptions[0].textContent, eventTargetElement.value);
								$(this).hide();
								eventTarget.parent().find('.ni-custom-dropdown').show();
						}
				});
				
				if (NI.viewport.is('<md')) {
						$(this).hide();
				}
				else
				{
						$(this).remove();
				}
				
		});

		$(document).click(function() {
				initDropdowns.closeDropdown();
		});

		$('.ni-custom-dropdown').click(function(event) {
				if (NI.viewport.is('<md')) {
						event.stopPropagation();
						var eventTarget = $(event.target);
						var eventTargetElement = eventTarget[0];
						var eventCustomClass = eventTargetElement.className;
						var eventOriginalClass = eventCustomClass.replace('ni-custom-dropdown ', '.').replace(' ni-custom-select', '');
						eventTarget.parent().find(eventOriginalClass).show().focus();
						eventTarget.hide();
				} else {
						initDropdowns.closeDropdown();
						event.stopPropagation();
						//  //if we add the spinner back
						//  //$(this).find('.act-spinner').show();
						//  //Look at maybe using the $(document).find instead of $openedDropdown.  See if performance is better.
						$selectedDropdown = $(this).find('.ni-custom-dropdown-contents');
						if ($openedDropdown === null) {
								$openedDropdown = $selectedDropdown;
						}
						initDropdowns.openDropdown($(this).find('.ni-custom-dropdown-contents UL'));
				}
		});
};

initializeDropdowns.prototype.openDropdown = function() {
  if ($openedDropdown === null) {
						$openedDropdown = $selectedDropdown;
				}
				var $selectedDropdownParent = $selectedDropdown.parent();
				//TODO: add flip dropdown if side of screen    
				if ($selectedDropdown.css('display') === 'none') { //$('.act-spinner').hide();
						$selectedDropdownParent.addClass('opened');
						if ($selectedDropdownParent.outerWidth() > $selectedDropdown.width()) {
								$selectedDropdown.css('width', $selectedDropdownParent.outerWidth());
						}
						$selectedDropdown.slideDown('fast').addClass('ni-custom-dropdown-container-border');
						$selectedDropdown.scrollTop($selectedDropdown.position().top);
						$openedDropdown = $selectedDropdown;
				} else {
						$openedDropdown.slideUp('fast');
				}
};

initializeDropdowns.prototype.closeDropdown = function() {
		$openedDropdown.parent().removeClass('opened');
		$openedDropdown.slideUp('fast');
};

initializeDropdowns.prototype.attachKeyboard = function() {
		$selectedDropdown.find('li').each(function(){
																																				
						$(this).keydown(function(){
							var x = 0;
										if(e.keyCode == 38)
														x = -1;
										else if(e.keyCode == 40)
														x = 1;
										else
														return;
						
						});
		});
};
/* TODO: In setThisDropValue, go back to passing ID instead of name, as they are unique and names can match */
addToNamespace("NI.forms").setThisDropValue = function(id, optionKey, optionValue, optionalCallback)
{
		var idText = id+'Text';
		$('[id="'+idText+'"]').text(optionKey);
		$('[id="'+id+'"]').val(optionValue);
		$('[name="'+id+'"]').val(optionValue);
		try
		{
				$('[id="'+id+'"]').val(optionValue).change();
				$('[name="'+id+'"]').val(optionValue).change();
		}
		catch(e) {}

		if (optionalCallback !== null) {
				eval(optionalCallback);
		} else if ($afterEditCallback !== null) {
				$afterEditCallback();
		}
};

