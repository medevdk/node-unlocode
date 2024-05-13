#!/usr/local/bin/node

	const obj = require('./country.json');

	module.exports  = {

		getByUnloCode: function(countryId, portId)	{
			var _country = countryId.toUpperCase();
			var res = {};
			var list;

			if(!obj[_country]) return res;

			res.country = this.getCountryById(_country);
			list = this.getPortById(portId);

			if(list.length != 0) {
				var el = list.filter(searchInCountry);
				if(el.length != 0) res.port = el[0].port;	
			}
			return res;

			function searchInCountry(element) {
				if(element.countryid === _country) return element;
			}
		},
			
		getCountryById: function(Id) {
			var _Id = Id.toUpperCase();
			if(obj[_Id]) return obj[_Id].countryname;
		},
		
		getCountryByName: function(name) {
			var _name = name.toUpperCase();
			var res = [];

			Object.keys(obj).forEach(function(countryId) {
				if(obj[countryId].countryname.indexOf(_name) != -1) {
					res.push({
						countryid:countryId,
						countryname:obj[countryId].countryname
					})
				}
			})
			return res;
		},

		getPortById: function(portId) {
			var _portId = portId.toUpperCase();
			var res = [];
			var arrCountryKeys = Object.keys(obj);
			
			arrCountryKeys.forEach(function(countryId) {
				var node = obj[countryId].ports.filter(searchId);
				if(node.length != 0) {
					res.push({
						countryid:countryId,
						port:node[0][_portId].portname
					});
				}
			})
			function searchId(index) {
				if(Object.keys(index)[0] === _portId.toUpperCase()) {
					return index;
				}
			}
			return res;
		},

		getPortByName: function(portName) {
			var _portName = portName.toUpperCase();
			var node, res = [];

			Object.keys(obj).forEach(function(countryId) {
				node = obj[countryId].ports.filter(callback);

				if(node.length != 0 ) {
					node.forEach(function(port) {
						var key = Object.keys(port);
						res.push({
							countryid: countryId,
							portid: key[0],
							portname: port[key].portname,					
						})
					})
				}
			});
			return res;

			function callback(element) {

				var _id = Object.keys(element)[0];
				if(element[_id]  && element[_id].portname.toUpperCase().indexOf(_portName) != -1) {
					return element;
				}
			}			
		}

	}
