/**
 * Created by kkazmierowski on 30/04/17.
 */

"use strict";

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const moment = require('moment');
const session = require('express-session');

const user = require('../db/db_user');
const connect = require('./../db/db_connect');

router.get('/allUsers', (req, res) => {

    let connection = connect.createConnection();

    connection.query('select * FROM user_tab', function (e, rows, fields) {
        if (e) throw e;
        res.send(rows);
    });

    connection.end();
});

router.get('/getUser/:id', (req, res) => {

    let connection = connect.createConnection();

    connection.query('select * FROM user_tab WHERE user_id = ' + req.params.id, function (e, rows, fields) {
        if (e) throw e;
        res.send(rows);
    });
});

router.get('/deleteUserType/:id', (req, res) => {

    let connection = connect.createConnection();

    connection.query('DELETE FROM userType_tab WHERE userType_id = ' + req.params.id, function (e, rows, fields) {
        if (e) throw e;
        res.send(true);
    });

    connection.end();
});

router.post('/auth', (req, res) => {
    let connection = connect.createConnection();

    connection.query("CALL checkUser('" + req.body.email + "','" + req.body.pass + "')", function (e, rows, fields) {

        if (e) throw e;

        else if (rows[0][0].user_id !== 0) {
            req.session.userEmail = req.body.email;
            req.session.userId = rows[0][0].user_id;
            req.session.save(function () {

                user.saveSessionId(req.sessionID, rows[0][0].user_id, function () {
                    res.send(rows[0]);
                });
            });

        } else if (rows[0][0].user_id === 0) {
            res.send(false);
        } else {
            // todo: add function to log events like this
        }
    });

    connection.end();
});

router.get('/userProjectsInfo', (req, res) => {
    let connection = connect.createConnection();

    connection.query('SELECT project_id, project_name FROM userToProject_mix ' +
        'JOIN project_tab ON project_id = userToProject_projectId AND userToProject_userId = "' + req.session.userId + '"',
        function (e, rows, fields) {
            if (e) {
                return
            }
            else {
                res.send(rows);
            }
        });

    connection.end();
});

router.get('/userBoardsInfo', (req, res) => {
    let connection = connect.createConnection();

    connection.query('SELECT board_id, board_name FROM userToBoard_mix ' +
        'JOIN board_tab ON board_id = userToBoard_boardId AND userToBoard_userId = "' + req.session.userId + '"',
        function (e, rows, fields) {
            if (e) {
                return
            }
            else {
                res.send(rows);
            }
        });

    connection.end();
});

router.get('/userFrontendData', (req, res) => {
    let connection = connect.createConnection();


    connection.query('CALL getUserFrontend("2")',
        function (e, rows, fields) {
            if (e) {
                return
            }
            else {
                res.send(rows[0][0]);
            }
        });

    connection.end();
});

router.get('/userCompleteFrontendData', (req, res) => {

    user.getCompleteFrontendData(req.session.userId, function(data) {
        res.send(data);
    })
});

module.exports = router;