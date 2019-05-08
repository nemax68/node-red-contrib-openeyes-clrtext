/**
 * Copyright 2018 OPEN-EYES S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/

var PosixMQ = require('posix-mq');

module.exports = function (RED) {
	"use strict";

	function GuiClrText(config) {
		RED.nodes.createNode(this,config);
        this.name = config.name;
        this.cmd = config.cmd;
        this.queue = '/gui_cmd';
		var node = this;

        node.on('input', function(msg) {
            var posixmq = new PosixMQ();

            try{

                switch (node.cmd) {
                case "1":
                    var type = "deltext";
                    break;
                case "2":
                    var type = "delboxtext";
                    break;
                default:
                    var type = "none";
                }

                var obj = {
                    type: type,
                    name: node.name
                };

                var strJSON = JSON.stringify(obj);

                console.log(strJSON);

                posixmq.open({ name: node.queue, create: false });
                posixmq.push(strJSON);
                posixmq.close();
                node.status({fill: "green", shape: "dot", text: node.queue.toString()});
            }
            catch(err){
                console.error(err);
                node.status({fill: "red", shape: "dot", text: node.queue.toString()});
            }

        });

	}

	RED.nodes.registerType("clr-text", GuiClrText);
}
