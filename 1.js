function init_form_admin() {
  var events = ['focus', 'change'];
  for (var i = 0; i < events.length; i++) {
    if ($('f_trav_departure_date') && $('f_trav_departure_date').getValue() && $('f_trav_arrival_date') && $('f_trav_arrival_date').getValue()) {
      $('f_trav_departure_date').observe(events[i], function() {
          dateDiff('D', getDate($('f_trav_departure_date')), getDate($('f_trav_arrival_date')), $('f_trav_arrival_date'), 'Trip length ');
        dateDiff('D', 'today', getDate($('f_trav_departure_date')), $('f_trav_departure_date'), 'Leaving in ');
      });

      $('f_trav_arrival_date').observe(events[i], function() {
          console.log(123);
        dateDiff('D', getDate($('f_trav_departure_date')), getDate($('f_trav_arrival_date')), $('f_trav_arrival_date'), 'Trip length ');
      });
    }
  }
  if ($('f_trav_departure_date') && $('f_trav_arrival_date')) {
    dateDiff('D', getDate($('f_trav_departure_date')), getDate($('f_trav_arrival_date')), $('f_trav_arrival_date'), 'Trip length ');
    dateDiff('D', 'today', getDate($('f_trav_departure_date')), $('f_trav_departure_date'), 'Leaving in ');
  }
  if ($('f_trav_departure_date')) {
    dateDiff('D', 'today', getDate($('f_trav_departure_date')), $('f_trav_departure_date'), 'Leaving in ');
  }

  var events = ['keypress', 'change'];
  for (var i = 0; i < events.length; i++) {
    var fields = ['fi_employer_name', 'fi_employer_address', 'fi_employer_phone', 'fi_school_name', 'fi_school_address', 'fi_school_phone'];
    for (var ii = 0; ii < fields.length; ii++) {
      if (!$(fields[ii])) continue;
      $(fields[ii]).observe(events[i], function() {
        remainChr(fields, 185);
      });
    }
  }
  remainChr(fields, 185);

  if(document.getElementById("f_trav_departure_date")) {
    document.getElementById("f_trav_departure_date").onblur = function() {
      if ($(this).value !== '') {
        arrivalDepartureDiff('D', 'today', getDate($(this)), $(this));
      }
    };
  }

  if(document.getElementById("fi_trav_origin_departure_date")) {
    document.getElementById("fi_trav_origin_departure_date").onblur = function() {
      if ($(this).value !== '') {
        arrivalDepartureDiff('D', 'today', getDate($(this)), $(this));
      }
    };
  }

  if(document.getElementById("f_trav_arrival_date")) {
    document.getElementById("f_trav_arrival_date").onblur = function() {
      if ($(this).value !== '') {
        arrivalDepartureDiff('D', 'today', getDate($(this)), $(this));
      }
    };
  }

}

function getDate(form_element) {
  var get_date = form_element.getValue().split("-");
  if (form_element == $('f_trav_arrival_date')) {
    get_date = new Date(get_date[0], get_date[1] - 1, get_date[2] - (-1));
  } else {
    get_date = new Date(get_date[0], get_date[1] - 1, get_date[2]);
  }
  return get_date;
}

function dateDiff(interval, date1, date2, element, title) {
  var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
  interval = interval.toUpperCase();
  if (date1 == 'today') {
    date1 = new Date();
  }
  var trip_length = Math.ceil((date2.getTime() - date1.getTime()) / eval('(objInterval.' + interval + ')'));
  if (!element.up().down('.days')) {
    element.up().insert({'bottom': ' <span class="days"></span>'});
    element.up('.field_wrapper').down('.help').remove();
  } 
  element.up().down('.days').update(title + trip_length + ' days');
}

function arrivalDepartureDiff(interval, date1, date2, element) {
  var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
  interval = interval.toUpperCase();
  if (date1 == 'today') {
    date1 = new Date();
  }
  var trip_length = Math.ceil((date2.getTime() - date1.getTime()) / eval('(objInterval.' + interval + ')'));
  if (element.id == "f_trav_departure_date" || element.id == "fi_trav_origin_departure_date") {
    if (trip_length < 0) {
      alert('This date can\'t be before today.');
      element.value = "";
    } else if (trip_length > 366) {
      alert('This date can\'t be after one year from today.');
      element.value = "";
    }
  } else if (element.id == "f_trav_arrival_date") {
    if (trip_length < 0) {
      alert('This date can\'t be before today.');
      element.value = "";
    } else if (trip_length > 1827) {
      alert('This date can\'t be more than 5 years after date of arrival.');
      element.value = "";
    }
  }
}

function remainChr(fields, limit) {
  var count = 0;
  for (var i = 0; i < fields.length; i++) {
    if (!$(fields[i])) continue;
    $(fields[i]).up('.field_wrapper').select('input').each(function(el) {
      count += el.getValue().length;
    });
  }
 
  var remaining = limit - count;

  for (var i = 0; i < fields.length; i++) {
    var element = $(fields[i]);
    if (!element) continue; 
    if (!element.up().down('.limit')) {
      element.up().insert({'bottom': ' <span class="limit"></span>'});
      if(element.up('.field_wrapper').down('.help')) {
        element.up('.field_wrapper').down('.help').remove();
      }
    } 
    element.up().down('.limit').update(remaining  + ' characters left');    
  }
}


function activate_moving_save_button() {

  var moving_save_button = Element.clone($('save_button'), true);
  moving_save_button.writeAttribute('id', 'moving_save_button');
  moving_save_button.writeAttribute('name', 'moving_save_button');
  moving_save_button.update('Save Changes');
  $('application_form').down('div.elements_wrapper').insert({'bottom': moving_save_button})

  if($('moving_save_button') != undefined) {
    Event.observe(window, 'scroll', function() {
      var value = document.viewport.getScrollOffsets();
      var userSight = value[1] + (document.viewport.getHeight() / 2);
      if($('moving_save_button').up('#opendiv_edit_application_form') != undefined) {
        var parentDiv = $('moving_save_button').up('#opendiv_edit_application_form');  
      } else {
        var parentDiv = $('moving_save_button').up('div');
      }
      var parentDivOffset = parentDiv.positionedOffset();
      var parentDivslimit = parentDiv.offsetHeight + parentDivOffset[1];
      if( (userSight  < parentDivslimit) && (userSight > parentDivOffset[1]) )  {
        $('moving_save_button').style.top = (userSight - parentDivOffset[1]) + 'px';
      }
      if(userSight >= parentDivslimit-60) {
        $('moving_save_button').style.top = parentDiv.offsetHeight-60 + 'px';
      }
      if(userSight < parentDivOffset[1]) {
        $('moving_save_button').style.top = '0px';
      }
    });
  }

  if (($('save_button') != undefined) & ($('moving_save_button') != undefined)) {
      $('save_button').style.display = 'none';
  }

  if ($('moving_save_button')) {
    Event.observe('moving_save_button', 'click', function() {
      disable_submit();
      if ($('application_form').is_new && $('application_form').is_new.value == 'new') {
        $('application_form').process.value = 'create_new_form';
      } else {
        $('application_form').process.value = 'save_form';
      }
      save_application();
    });
  }
}
