'use strict';

var winston = module.parent.require('winston'),
    Meta = module.parent.require('./meta'),
    SendInBlue = require('sendinblue-api'),
    Emailer = {};

var settings = {};

Emailer.init = function(data, callback) {
    function renderAdminPage(req, res) {
        res.render('admin/emailers/local', {});
    }

    data.router.get('/admin/emailers/local', data.middleware.admin.buildHeader, renderAdminPage);
    data.router.get('/api/admin/emailers/local', renderAdminPage);

    Meta.settings.get('emailer-local', function(err, _settings) {
        if (err) {
            return winston.error(err);
        }
        settings = _settings;
    });

    callback();
};

Emailer.send = function(data, callback) {

    var parameters = {
        apiKey: settings['emailer:local:apikey'],
        timeout: settings['emailer:local:timeout']
    };

    var mailOptions = {
        from: [data.from, data.from_name],
        to: {},
        html: data.html,
        text: data.plaintext,
        subject: data.subject
    };
    mailOptions.to[data.to] = data.username ? data.username : data.to;

    var sendinObj = new SendInBlue(parameters);
    sendinObj.send_email(mailOptions, function(err, response){
        if ( !err ) {
            if (response.code !== 'success') {
                winston.info('[emailer.sendinblue] Response: ' + JSON.stringify(response) );
                winston.info('[emailer.sendinblue] Mail To: ' + JSON.stringify(mailOptions.to) + ', Mail From: ' + JSON.stringify(mailOptions.from));
            }
            winston.info('[emailer.sendinblue] Sent `' + data.template + '` email to uid ' + data.uid);
        } else {
            winston.warn('[emailer.sendinblue] Unable to send `' + data.template + '` email to uid ' + data.uid + '!');
        }
        callback(err, data);
    });
};

Emailer.admin = {
    menu: function(custom_header, callback) {
        custom_header.plugins.push({
            "route": '/emailers/local',
            "icon": 'fa-envelope-o',
            "name": 'Emailer SendInBlue'
        });

        callback(null, custom_header);
    }
};

module.exports = Emailer;
