$('#portfolioModal').on('show.bs.modal', function (event) 
{
  var button = $(event.relatedTarget);
  var buttonContent = button.data('content');
  var overviewContent, modalTitle, aboutContent;
  var modal = $(this);
  modal.find('img').attr('src', button.attr('src'));
  
  switch(buttonContent) {
    case 'userflow':
         modalTitle = 'New Product Dev';
         aboutContent = 'Responsibilities: <ul><li>User Interview Synthesis</li><li>Persona Creation</li><li>Feature Definition</li><li>User Flow</li></ul>';
         overviewContent = 'Using a feature list created from the systhensis of the user interviews, I created a persona and a path for the persona through the application.';
         break;
    case 'dropdown':
         modalTitle = 'Custom Library Dev';
         aboutContent = 'Responsibilities: <ul><li>UX Design</li><li>UI Development</li><li>Custom library extension</li></ul><p><a href="codesamples/customdropdown.js" target="_blank">See some of the code&hellip;</a></p>';
         overviewContent = 'While at NI, a primary task was to add to the custom JS library they had.  This particular example was a custom/styled dropdown.  At the time, we had no way to have a styled dropdown but also have the native mobile dropdown experience.  This was written so that the developer could put in a <select> tag with the appropriate class and upon page initialization, it was swapped out for a style/div select.  When on a mobile device, activation of the select then hid the styled select, showed the standard HTML select, then focused it, so that the native functionality for selects would take over.  Upon selection the hiding/showing happened in reverse.';
         break;
    case 'persona':
         modalTitle = 'Discovery & Research';
         aboutContent = 'Responsibilities: <ul><li>User Interviews</li><li>Persona Creation</li></ul>';
         overviewContent = 'After meeting with stakeholders to get a clear picture of what we wanted the app to achieve and doing some competative analysis, I was tasked with determining who our primary users would be, conduct user interviews and create a persona that would allow us to make informed design decisions before getting into the prototyping and user testing phase.';
         break;
    case 'styleguide':
         modalTitle = 'Style Guide for Developers';
         aboutContent = 'Responsibilities: <ul><li>Style Guide Creation</li><li>Modular Code Development</li></ul>';
         overviewContent = 'Early on during my tenure at NI, the website was run by 500+, siloed applications. As the only team horrizontal across all the applications, consistency for the user and code re-use was our primary goal. I, along with the other Sr. Dev, created and maintained a developer\'s style guide where other developers could see a working example of, and grab a code-snippet of some of our standard functionality so that we could successfully maintain consistency across multiple applications and multiple local and remote developers.';
         break;
    case 'googleaddress':
         modalTitle = 'International Address Autocomplete';
         aboutContent = 'Responsibilities: <ul><li>Implmentation and Extension of 3rd Party Code</li><li>Modular Code Development</li></ul><p><a href="codesamples/googleAddressAutocomplete.js" target="_blank">See some of the code&hellip;</a></p>';
         overviewContent = 'NI wanted to utilize Google\'s Places API to create an autocomplete of the school selection for US and international academic users.  I created set of functions that would loop through the return from the Places API upon school selection and parse the data to fill out the corresponding field on our address form.';
         break;
    case 'photos':
         modalTitle = 'Personal Photography Site';
         aboutContent = 'Responsibilities: <ul><li>Design</li><li>Development</li><li>Content Generation</li></ul><p><a href="http://www.mattmccainphotography.com" target="_blank">Check out the full site&hellip;</a></p>';
         overviewContent = 'In some of my free time, I not only work in photography, I create and maintain my personal photography website and social media accounts.';
         break;
    default:
         modalTitle = 'About content title missing.';
         aboutContent = 'About content missing.';
         overviewContent = 'Overview content missing.';               
  } 
  modal.find('#overview').text(overviewContent);
  modal.find('#portfolioModalLabel').text(modalTitle);
  modal.find('#aboutContent').html(aboutContent);
});

$(document).ready(function(){
  $('[data-toggle=collapse]').click(function () {
    var trigger = $(this);
    if (trigger.text().indexOf('see more')>-1) {
      trigger.text('close');
    }
    else {
     trigger.html('see more&hellip;'); 
    }
  });
});