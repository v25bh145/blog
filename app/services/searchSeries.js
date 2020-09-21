let sqlClass = require('../helpers/mysql-auto-build-class');

sqlClass.setConfigPath('../configs/mysql.json');

let getSeriesName = function (id, cb) {
    let sqlObj = sqlClass.form('series');
    sqlObj.where('id', id);
    sqlObj.select(function (obj) {
        if (obj.error) cb(1, obj.errorInfo);
        else {
            cb(0, obj.data[0].name);
        }
    })
}

exports.searchSeries = function (archive, cb) {
    getSeriesName(archive.series_id, function (err, data) {
        if (err) cb(1, data);
        else {
            let seriesName = data;
            let sqlObj = sqlClass.form('archives');
            sqlObj.where('series_id', archive.series_id);
            sqlObj.select(function (obj) {
                if (obj.error) cb(1, obj.errorInfo);
                else {
                    let seriesList = [];
                    obj.data.forEach(element => {
                        seriesList.push({
                            id: element.id,
                            name: element.name,
                            order: element.order
                        });
                    });
                    cb(0, {
                        seriesName: seriesName,
                        seriesList: seriesList
                    });
                }
            })
        }
    });
}