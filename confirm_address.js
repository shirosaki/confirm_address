/**
 * confirm_address plugin
 * @author Hiroshi Shirosaki
 */

window.rcmail && rcmail.addEventListener('beforesend', function (event) {
  // event may be props
  if (event.do_send) {
    return true;
  }
  if (!event.nocheck && !rcmail.env.is_sent && !rcmail.check_compose_input('send')) {
    return false;
  }
  var form = window.document,
    input_to = $("[name='_to']", form),
    input_cc = $("[name='_cc']", form),
    input_bcc = $("[name='_bcc']", form),
    get_recipients = function(fields) {
      var recipients = [];
      $.each(fields, function(_, v) {
        v = $.trim(v.val());
        $(addressparser(v)).each(function (index, value) {
          recipients.push(value);
        });
      });
      return recipients;
    };

  var mydomain = rcmail.env.confirm_address_my_domain;
  var myul = $('<ul>').addClass('my-domain');
  var otherul = $('<ul>').addClass('other-domain');
  var formatAddress = function(value) {
    var address = value.address;
    if (value.name != "") {
      address = value.name + " <" + value.address + ">";
    }
    return address;
  };
  $(get_recipients([input_to, input_cc, input_bcc])).each(function (index, value) {
    var li = $('<li>').addClass("confirm-address-li")
      .append($('<label>').append($('<input type="checkbox">')).append($('<span>').text(formatAddress(value))));
    if (mydomain && value.address.indexOf('@' + mydomain) > 0) {
      myul.append(li);
    } else {
      otherul.append(li);
    }
  });

  // dialog content
  var content = $('<div>').addClass('confirm-address-dialog');
  if (myul.find('li').length > 0) {
    content.append($('<div>').append($('<label>')
      .text(rcmail.gettext('confirm_address.mydomainaddress'))
      .prepend($('<input type="checkbox">').addClass('confirm-address-all').attr('id', 'allcheck')))
      .append(myul));
  }
  if (otherul.find('li').length > 0) {
    content.append($('<div>').text(rcmail.gettext('confirm_address.otherdomainaddress')).append(otherul));
  }

  var dialog = rcmail.simple_dialog(
    content,
    rcmail.gettext('confirm_address.dialogtitle'),
    function () {
      dialog.dialog('close');
      rcmail.command('send', { nocheck: true, do_send: true });
    },
    {
      button: 'confirm_address.send',
      cancel_label: 'close',
      cancel_button: 'close'
    });

  // set check events
  var send = dialog.parent().find('.send');
  send.prop('disabled', true);
  dialog.on('click', 'input[type="checkbox"]', function (event) {
    var target = $(event.target);
    if (target.attr('id') === 'allcheck') {
      var allchecked = target.prop('checked');
      dialog.find('.my-domain li input[type="checkbox"]').each(function () {
        $(this).prop('checked', allchecked);
      });
    } else {
      var mydomainchecked = true;
      dialog.find('.my-domain li input[type="checkbox"]').each(function () {
        mydomainchecked = mydomainchecked && $(this).prop('checked');
      });
      dialog.find('#allcheck').prop('checked', mydomainchecked);
    }
    var checked = true;
    dialog.find('li input[type="checkbox"]').each(function () {
      checked = checked && $(this).prop('checked');
    });
    send.prop('disabled', !checked);
  });
  return false;
});
