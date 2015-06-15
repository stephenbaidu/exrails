'use strict';

/**
 * @ngdoc service
 * @name angularApp.reportService
 * @description
 * # reportService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('reportService',function ($document) {
    return {
      toCSV: function(reportTitle, reportData, columns, showLabels) {
        var jsonData = this.objectify(reportData);
        columns = columns || this.getColumns(jsonData);
        reportTitle = reportTitle || 'Report';
        showLabels = showLabels || true;
        var fileName = 'Report_' + (new Date()).toISOString().replace(/\:/g, '-').replace('.', '-') + '.csv'
        
        var CSV = '';    
        //Set Report title in first row or line
        
        CSV += reportTitle + '\r\n\n';

        if (showLabels) {
          var row = _.chain(columns)
            .map(function (e) {
              return e.title
            })
            .value().join(',');

          CSV += row + '\r\n';
        }

        CSV += _.chain(jsonData)
          .map(function (row) {
            return _.chain(columns)
              .map(function (e) {
                return row[e.key];
              })
              .value().join(',');
          }).value().join('\r\n');
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Trigger download
        var link = $document[0].createElement("a");    
        link.href = uri;
        link.style.visibility = "hidden";
        link.download = fileName;
        
        //this part will append the anchor tag and remove it after automatic click
        $document[0].body.appendChild(link);
        link.click();
        $document[0].body.removeChild(link);
      },
      toPDF: function(reportTitle, reportData, columns) {
        var jsonData = this.objectify(reportData);
        columns = columns || this.getColumns(jsonData);
        reportTitle = reportTitle || 'Report';
        var fileName = 'Report_' + (new Date()).toISOString().replace(/\:/g, '-').replace('.', '-') + '.pdf'

        var doc = new jsPDF('l', 'pt');
        
        var header = function (doc, pageCount, options) {
          doc.setFontSize(20);
          doc.text(reportTitle, options.margins.horizontal, 60);
          doc.setFontSize(options.fontSize);
        }
        
        doc.autoTable(columns, jsonData, {
          renderHeader: header,
          margins: {horizontal: 40, top: 80, bottom: 50}
        });
        
        doc.save(fileName);
      },
      objectify: function(data) {
        return (typeof data != 'object') ? JSON.parse(data) : data;
      },
      getColumns: function(data) {
        var allowedTypes = ['string', 'number'];
        var rec = data[0];
        return _.chain(rec)
          .keys()
          .reject(function(e) {
            return e.indexOf('$') == 0;
          })
          .filter(function(e) {
            return allowedTypes.indexOf(typeof rec[e]) >= 0;
          })
          .map(function(e) {
            return {title: e, key: e};
          })
          .value();
      }
    };
  });