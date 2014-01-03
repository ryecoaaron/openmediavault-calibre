/**
 * Copyright (C) 2014 OpenMediaVault Plugin Developers
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
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")

Ext.define("OMV.module.admin.service.calibre.Settings", {
    extend : "OMV.workspace.form.Panel",
    uses   : [
        "OMV.data.Model",
        "OMV.data.Store"
    ],

    rpcService   : "Calibre",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    initComponent : function() {
        var me = this;

        me.on('load', function () {
            var checked = me.findField('enable').checked;
            var showtab = me.findField('showtab').checked;
            var parent = me.up('tabpanel');

            if (!parent)
                return;

            var gridPanel = parent.down('grid');
            var webPanel = parent.down('panel[title=' + _("Web Interface") + ']');

            if (gridPanel)
                checked ? gridPanel.enable() : gridPanel.disable();
            if (webPanel) {
                checked ? webPanel.enable() : webPanel.disable();
                showtab ? webPanel.tab.show() : webPanel.tab.hide();
            }
        });

        me.callParent(arguments);
    },

    getFormItems : function() {
        var me = this;
        return [{
            xtype    : "fieldset",
            title    : "General settings",
            defaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype         : "combo",
                name          : "mntentref",
                fieldLabel    : _("Library Volume"),
                emptyText     : _("Select a volume ..."),
                allowBlank    : false,
                allowNone     : false,
                editable      : false,
                triggerAction : "all",
                displayField  : "description",
                valueField    : "uuid",
                store         : Ext.create("OMV.data.Store", {
                    autoLoad : true,
                    model    : OMV.data.Model.createImplicit({
                        idProperty : "uuid",
                        fields     : [
                            { name : "uuid", type : "string" },
                            { name : "devicefile", type : "string" },
                            { name : "description", type : "string" }
                        ]
                    }),
                    proxy : {
                        type : "rpc",
                        rpcData : {
                            service : "ShareMgmt",
                            method  : "getCandidates"
                        },
                        appendSortParams : false
                    },
                    sorters : [{
                        direction : "ASC",
                        property  : "devicefile"
                    }]
                })
            },{
                xtype      : "textfield",
                name       : "library-folder",
                fieldLabel : _("Library Folder"),
                allowNone  : true,
                readOnly   : true
            },{
                xtype         : "numberfield",
                name          : "port",
                fieldLabel    : _("Port"),
                vtype         : "port",
                minValue      : 1,
                maxValue      : 65535,
                allowDecimals : false,
                allowNegative : false,
                allowBlank    : false,
                value         : 8080,
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("Port to listen on.")
                }]
            },{
                xtype      : "textfield",
                name       : "username",
                fieldLabel : _("Username"),
                allowBlank : true,
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("Username for access - optional")
                }]
            },{
                xtype      : "textfield",
                name       : "password",
                fieldLabel : _("Password"),
                allowBlank : true,
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("Set a password to restrict access - optional")
                }]
            },{
                xtype      : "textfield",
                name       : "coversize",
                fieldLabel : _("coversize"),
                allowBlank : true,
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("The maximum size for displayed covers. Default is '600x800' - optional")
                }]
            },{
                xtype      : "checkbox",
                name       : "development",
                fieldLabel : _("Development"),
                boxLabel   : _("Enables development mode"),
                checked    : false
            },{
                xtype      : "checkbox",
                name       : "showtab",
                fieldLabel : _("Show Tab"),
                boxLabel   : _("Show tab containing web interface frame."),
                checked    : false
            },{
                xtype      : "textarea",
                name       : "extraoptions",
                fieldLabel : _("Extra options"),
                allowBlank : true
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/calibre",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.calibre.Settings"
});