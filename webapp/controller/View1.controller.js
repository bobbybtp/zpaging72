sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
function (Controller,JSONModel,Filter) {
    "use strict";

    return Controller.extend("zpaging72.controller.View1", {
        onInit: function () {
           var that = this;
           that.previous = that.byId("previous");
           that.previous.setEnabled(false);
           that.clicks = 0;
           that.initialCount = 0;

           that.bindTable( that.clicks, 0);
           that.bindTable( that.clicks, 5);
        },


        bindTable:function(count, top)
        {
            var that = this;
            that.top = top;
            sap.ui.core.BusyIndicator.show();
            var oModel = this.getOwnerComponent().getModel("invoice2");

            var path = "/ZFIORIPRACSet";
           
            oModel.read(path, {
                async: true,
                urlParameters: {
                    "$top" : top,
                    "$skip": count
                },
                success: function(tdata) {
                    if (that.top !== 0 ) {
                        var oTab = that.byId("otable");
                        var json = new JSONModel();
                        json.setData(tdata);
                        oTab.setModel(json);
                        oTab.bindItems("/results", new sap.m.ColumnListItem({ //'results' holds the OData results
                            cells: [
                                new sap.m.Text({
                                    text: "{PRODUCTNAME}" //Product Id
                                }),
                                new sap.m.Text({
                                    text: "{QUANTITY}" //Product Name
                                }),
                                new sap.m.Text({
                                    text: "{EXTENDEDPRICE}" //Supplier
                                }),
                                new sap.m.Text({
                                    text: "{SHIPPERNAME}" //Dimensions
                                }),
                                new sap.m.Text({
                                    text: "{SHIPPERDATE}" //Weight
                                }),
                                new sap.m.Text({
                                    text: "{STATUS}" //Price
                                })
                            ]
                        }));

                    }
                    else
                    {
                        that.initialCount = tdata.results.length;
                    }
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function () {

                }
            })


        },

        onNext:function()
        {
            var that = this;
            that.clicks = that.clicks + 1;
            if (that.clicks > 0) {
                var previous = that.byId("previous");
                previous.setEnabled(true);
            }
            var skipCount = that.clicks * 5;
            if (skipCount >= that.initialCount - 5) {
                var next = that.byId("next");
                next.setEnabled(false);
            }
            that.bindTable(skipCount, 5);
        },

        onPrevious: function () {
            var that = this;
               that.clicks = that.clicks - 1;
               if (that.clicks === 0) {
                   var previous = that.byId("previous");
                   previous.setEnabled(false);
               }
               var skipCount = that.clicks * 5;
               if (skipCount <= that.initialCount - 5) {
                   var next = that.byId("next");
                   next.setEnabled(true);
               }
               that.bindTable(skipCount, 5);
           },


        handleSearch : function (oEvt) {

            // add filter for search
            var aFilters = [];
            var sQuery = oEvt.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("PRODUCTNAME", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
    
            // update list binding
            var list = this.getView().byId("otable");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");
        }

    });
});
