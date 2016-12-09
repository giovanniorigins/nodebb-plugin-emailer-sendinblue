'use strict';

var winston = module.parent.require('winston'),
    Meta = module.parent.require('./meta'),
    sendinblue = require('sendinblue-api'),
    // nodemailer = require('nodemailer'),
    // smtpTransport = require('nodemailer-smtp-transport'),
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
        from: data.from,
        to: data.to,
        html: data.html,
        text: data.plaintext,
        subject: data.subject
    };
    var sendinObj = new sendinblue(parameters);

    sendinObj.send_email(mailOptions).on('complete', function(success) {
        winston.info('[emailer.smtp] Sent `' + data.template + '` email to uid ' + data.uid);
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
