var placeSearch, autocomplete, addressField;
var placeChanged = false;
var googleComponentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  postal_town: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};
var iePlace;

function setCompanyNameForStupidIE()
{
  $('input[name="'+addressFormNames['companyName']+'"]').val(iePlace);
}

function getGoogleLanguage() {
  var NILang = (typeof($.cookie("locale"))!== 'undefined')?$.cookie("locale"):'en-US';
  
  if ((NILang.toLowerCase() !== 'zh-cn') && (NILang.toLowerCase() !== 'zh-tw') && (NILang.toLowerCase() !== 'pt-br') && (NILang.toLowerCase() !== 'pt-pt'))
  {
    NILang = NILang.substr(0,NILang.indexOf('-'));
  }
  return NILang;
}

function checkRequiredFields(addressFormNames) {
  var bStateChanged = $('select[name="'+addressFormNames['state']+'"]').find(':selected').val() !== '';
  if($('input[name="'+addressFormNames['address1']+'"]').val() != "" && $('input[name="'+addressFormNames['city']+'"]').val() != "" &&
    bStateChanged && $('input[name="'+addressFormNames['postalCode']+'"]').val() != "" && $('input[name="'+addressFormNames['companyName']+'"]').val() != "")
    {
      if ($('select[name="myInfoForm:primaryContact.role"]') && $('select[name="myInfoForm:primaryContact.role"]').length > 0)
      {
        var roleSelect = $('select[name="myInfoForm:primaryContact.role"]').siblings(".ui-selectmenu-button");
        $(roleSelect).focus();
      }
      else
      {
        $(".form-control.phone").focus();
      }
      return true;
    }
    else
    {
      if ($('select[name="myInfoForm:primaryContact.role"]') && $('select[name="myInfoForm:primaryContact.role"]').length > 0){
        var role = $('select[name="myInfoForm:primaryContact.role"]').find(':selected');
        if ($(role).val().indexOf("Student") != -1 || $(role).val().indexOf("Professor") != -1) {
          //if the only missing data is Address1
          if($('input[name="'+addressFormNames['address1']+'"]').val() == "" && $('input[name="'+addressFormNames['city']+'"]').val() != "" &&
            bStateChanged && $('input[name="'+addressFormNames['postalCode']+'"]').val() != "" && $('input[name="'+addressFormNames['companyName']+'"]').val() != ""){
            $('input[name="'+addressFormNames['address1']+'"]').val($('input[name="'+addressFormNames['companyName']+'"]').val());
            hideElements(addressFormNames,true);
          }
          // TO DO: add exception when not only Address1 is missing, (zip code, city, state)
        }
        else
        {
          $('input[name="'+addressFormNames['address1']+'"]').focus();
        }
        return false;
      }
      else
      {
        $('input[name="'+addressFormNames['address1']+'"]').focus();
      }
      return false;
    }
}

function initializeGoogleAddress() {
  if($('.googleautocomplete').length)
  {
    hideElementsInitially(addressFormNames);
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    var country = $('select[name="'+addressFormNames['country']+'"]').val();
    if (!country) {
      if ($.cookie && $.cookie("locale")) {
        country = $.cookie("locale").split("-")[1].toLocaleLowerCase();
      } else {
        country = "us";
      }
    }
    
    autocomplete = new google.maps.places.Autocomplete(
      ($('.googleautocomplete')[0]),
      { types: ['establishment'],
        componentRestrictions: {country:  country},
        key: 'AIzaSyCIFKa8gWaV3ZXDoa2v-30WLCjPgX_pFCo'});
        //key: 'AIzaSyDdDwaj1G6F3c9fMuE77zCEz8EQecoqI0o'});
   
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
      placeChanged = true;
      fillInGoogleAddress();
      $('input').blur(); //this is here to support our defaultValue.js shim for placeholder in IE9
      setTimeout('setCompanyNameForStupidIE()',100); //this is because IE won't let the field be overwritten as long as the google suggestion box is open
      if (checkRequiredFields(addressFormNames)) {
        hideElements(addressFormNames,true); // custid.js
      }
    });
    
    addressField = new google.maps.places.Autocomplete(
      ($('input[name="myInfoForm:primaryContact.address.address1"]')[0]),
      { types: ['address'],
        componentRestrictions: {country:  country},
        key: 'AIzaSyCIFKa8gWaV3ZXDoa2v-30WLCjPgX_pFCo'});
        //key: 'AIzaSyDdDwaj1G6F3c9fMuE77zCEz8EQecoqI0o'});
   
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(addressField, 'place_changed', function(e) {
      fillInGoogleCityInfo();
      $('input').blur(); //this is here to support our defaultValue.js shim for placeholder in IE9
    });
  }
}

function fillInGoogleCityInfo() {
  // Get the place details from the autocomplete object. Only for Addresses
  var placeAdress = addressField.getPlace();
  var hasStreet = false;
  for (var i = 0; i < placeAdress.address_components.length; i++) {
    var addressType = placeAdress.address_components[i].types[0];
    if ((placeAdress.adr_address.substr(0,placeAdress.adr_address.indexOf(', <'))).indexOf('<span') > -1)
    {
      tempElm = $('<p />').html(placeAdress.adr_address);
      $('input[name="'+addressFormNames['address1']+'"]').val(tempElm.find('.street-address').text());
      $('.company-address').text(tempElm.find('.street-address').text());
    }
    else
    {
      $('input[name="'+addressFormNames['address1']+'"]').val(placeAdress.adr_address.substr(0,placeAdress.adr_address.indexOf(', <')));
      $('.company-address').text(placeAdress.adr_address.substr(0,placeAdress.adr_address.indexOf(', <')));
    } 
    if ((addressType == 'locality') || (addressType == 'postal_town')) {
      $('input[name="'+addressFormNames['city']+'"]').val(placeAdress.address_components[i][googleComponentForm[addressType]]);
    }
    if (addressType == 'administrative_area_level_1') {
      $('select[name="'+addressFormNames['state']+'"]').val(placeAdress.address_components[i][googleComponentForm[addressType]]);
      selectedAddress = $('select[name="'+addressFormNames['state']+'"] option').filter(function() { 
          return ($(this).attr("value") == placeAdress.address_components[i][googleComponentForm[addressType]]); //To select Blue
        }).prop('selected', true);
      selectedAddress.trigger("change");
    }
    if (addressType == 'country') {
      $('input[name="'+addressFormNames['country']+'"]').val(placeAdress.address_components[i][googleComponentForm[addressType]]);
    }
    if (addressType == 'postal_code') {
      $('input[name="'+addressFormNames['postalCode']+'"]').val(placeAdress.address_components[i][googleComponentForm[addressType]]);
      $('.company-zip').text(placeAdress.address_components[i][googleComponentForm[addressType]]);
    }
  }
  iePlace = placeAdress.name;
}


function fillInGoogleAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  var googleVal = '';
  var hasStreet = false;
  var readOnlyAddress = '';
  $('input[name="'+addressFormNames['companyName']+'"]').blur();
  $('input[name="'+addressFormNames['address1']+'"]').val("");
  $('input[name="'+addressFormNames['city']+'"]').val("");
  $('select[name="'+addressFormNames['state']+'"]').val("");
  $('input[name="'+addressFormNames['country']+'"]').val("");
  $('input[name="'+addressFormNames['postalCode']+'"]').val("");

  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
     
    if ((place.adr_address.substr(0,place.adr_address.indexOf(', <'))).indexOf('<span') > -1)
    {
      tempElm = $('<p />').html(place.adr_address);
      $('input[name="'+addressFormNames['address1']+'"]').val(tempElm.find('.street-address').text());
      $('.company-address').text(tempElm.find('.street-address').text());
    }
    else
    {
      $('input[name="'+addressFormNames['address1']+'"]').val(place.adr_address.substr(0,place.adr_address.indexOf(', <')));
      $('.company-address').text(place.adr_address.substr(0,place.adr_address.indexOf(', <')));
    }
    
    
    if ((addressType == 'locality') || (addressType == 'postal_town')) {
      googleVal =  place.address_components[i][googleComponentForm[addressType]];
      readOnlyAddress = googleVal;
      $('input[name="'+addressFormNames['city']+'"]').val(googleVal);
      if (googleVal !== '')
      {
        hideElements(addressFormNames, false);
      }
    }
    if (addressType == 'administrative_area_level_1') {
      googleVal = place.address_components[i][googleComponentForm[addressType]];
      readOnlyAddress = readOnlyAddress + ", " + googleVal;
      $('select[name="'+addressFormNames['state']+'"]').val(googleVal);
      selectedAddress = $('select[name="'+addressFormNames['state']+'"] option').filter(function() {
      //selectedAddress = $("select[name='myInfoForm:primaryContact.address.state'] option").filter(function() { 
          return ($(this).attr("value") == googleVal); //To select Blue
        }).prop('selected', true);
      selectedAddress.trigger("change");
      //$(".ui-selectmenu-text").text(place.address_components[i][googleComponentForm[addressType]])
      if (googleVal !== '')
      {
        hideElements(addressFormNames, false);
      }
    }
    if (addressType == 'country') {
      googleVal = place.address_components[i][googleComponentForm[addressType]];
      $('input[name="'+addressFormNames['country']+'"]').val(googleVal);
      if (googleVal !== '')
      {
        hideElements(addressFormNames, false);
      }
    }
    if (addressType == 'postal_code') {
      if (googleVal !== '')
      {
        hideElements(addressFormNames, false);
      }
      $('input[name="'+addressFormNames['postalCode']+'"]').val(place.address_components[i][googleComponentForm[addressType]]);
      readOnlyAddress = readOnlyAddress + ", " + place.address_components[i][googleComponentForm[addressType]];
      $('.company-zip').text(readOnlyAddress);
    }
  }
  $('input[name="'+addressFormNames['companyName']+'"]').val(place.name);
  $('.company-name').text(place.name);
  iePlace = place.name;

  $('input[name="'+addressFormNames['googlePlaceData']+'"]').val(JSON.stringify(place));
}
 