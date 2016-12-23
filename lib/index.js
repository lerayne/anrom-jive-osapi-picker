'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

var _JiveTilePlacePicker = require('./JiveTilePlacePicker.css');

var _JiveTilePlacePicker2 = _interopRequireDefault(_JiveTilePlacePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by M. Yegorov on 2016-10-25.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var JivePlaceSelector = function (_Component) {
    _inherits(JivePlaceSelector, _Component);

    function JivePlaceSelector(props) {
        _classCallCheck(this, JivePlaceSelector);

        var _this = _possibleConstructorReturn(this, (JivePlaceSelector.__proto__ || Object.getPrototypeOf(JivePlaceSelector)).call(this, props));

        var value = props.value;

        var isArray = props.value instanceof Array;

        _this.state = {
            places: props.value ? isArray ? value : value.id > 0 ? [value] : [] : [],
            multiple: isArray,
            contentType: props.contentType || 'place'
        };
        return _this;
    }

    _createClass(JivePlaceSelector, [{
        key: 'render',
        value: function render() {
            var _classnames,
                _this2 = this;

            var _state = this.state,
                places = _state.places,
                multiple = _state.multiple,
                contentType = _state.contentType;


            var mainClasses = (0, _classnames3.default)((_classnames = {}, _defineProperty(_classnames, _JiveTilePlacePicker2.default.main, true), _defineProperty(_classnames, 'multiple', multiple), _classnames));

            return _react2.default.createElement(
                'div',
                { className: mainClasses },
                _react2.default.createElement(
                    'div',
                    { className: 'selected-places' },
                    places.map(function (place, i) {
                        return _react2.default.createElement(
                            'div',
                            { key: i },
                            _react2.default.createElement(
                                'span',
                                { className: 'selected' },
                                contentType == 'place' && _react2.default.createElement(
                                    'span',
                                    { className: 'name' },
                                    place.name
                                ),
                                contentType == 'people' && _react2.default.createElement(
                                    'span',
                                    { className: 'name' },
                                    place.name.formatted
                                ),
                                _react2.default.createElement(
                                    'a',
                                    { className: 'remove', onClick: function onClick(e) {
                                            return _this2.remove(e, i);
                                        } },
                                    '\xD7'
                                )
                            )
                        );
                    })
                ),
                (multiple || !places.length) && _react2.default.createElement(
                    'button',
                    { onClick: this.callPicker.bind(this) },
                    this.props.buttonTitle || 'Add place'
                )
            );
        }
    }, {
        key: 'callPicker',
        value: function callPicker(e) {
            var _this3 = this;

            e.preventDefault();

            var contentType = this.state.contentType;


            _osapi2.default.jive.corev3.search.requestPicker({
                excludeContent: contentType == 'people' || contentType == 'place',
                excludePlaces: contentType == 'people' || contentType == 'content',
                excludePeople: contentType == 'content' || contentType == 'place',
                success: function success(data) {
                    return _this3.add(data);
                },
                error: function error(data) {
                    console.error('error: ' + JSON.stringify(data));
                }
            });
        }
    }, {
        key: 'add',
        value: function add(place) {
            var _this4 = this;

            var filterFields = this.props.filterFields || this.filterFields;

            var placeExists = this.state.places.findIndex(function (targetPlace) {
                return targetPlace.id == place.placeID;
            }) != -1;

            if (!placeExists) {
                this.setState((0, _reactAddonsUpdate2.default)(this.state, {
                    places: { $push: [filterFields(place)] }
                }), function () {
                    return _this4.onChange();
                });
            }
        }
    }, {
        key: 'filterFields',
        value: function filterFields(place) {
            var placeID = place.placeID,
                name = place.name,
                resources = place.resources;


            return {
                name: name,
                id: placeID,
                uri: resources.self.ref
            };
        }
    }, {
        key: 'remove',
        value: function remove(e, i) {
            var _this5 = this;

            e.preventDefault();

            this.setState((0, _reactAddonsUpdate2.default)(this.state, {
                places: { $splice: [[i, 1]] }
            }), function () {
                return _this5.onChange();
            });
        }
    }, {
        key: 'onChange',
        value: function onChange() {
            if (typeof this.props.onChange == 'function') {
                var _state2 = this.state,
                    places = _state2.places,
                    multiple = _state2.multiple;


                var output = void 0;

                if (places.length) {
                    output = multiple ? places : places[0];
                } else {
                    output = multiple ? [] : this.props.default || false;
                }

                this.props.onChange(output);
            }
        }
    }]);

    return JivePlaceSelector;
}(_react.Component);

exports.default = JivePlaceSelector;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map