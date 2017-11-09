'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

var _JiveTilePlacePicker = require('./JiveTilePlacePicker.css');

var _JiveTilePlacePicker2 = _interopRequireDefault(_JiveTilePlacePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by M. Yegorov on 2016-10-25.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var JiveSelector = function (_Component) {
    _inherits(JiveSelector, _Component);

    function JiveSelector(props) {
        _classCallCheck(this, JiveSelector);

        var _this = _possibleConstructorReturn(this, (JiveSelector.__proto__ || Object.getPrototypeOf(JiveSelector)).call(this, props));

        var value = props.value;

        var isArray = props.value.length !== undefined;

        _this.state = {
            items: props.value ? isArray ? value : value.id > 0 ? [value] : [] : [],
            multiple: isArray,
            contentType: props.contentType
        };
        return _this;
    }

    _createClass(JiveSelector, [{
        key: 'componentWillreceiveProps',
        value: function componentWillreceiveProps(newProps) {
            if (this.props.value !== newProps.value) {

                var isArray = newProps.value.length !== undefined;

                this.setState({
                    items: isArray ? newProps.value : newProps.value.id > 0 ? [newProps.value] : []
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                items = _state.items,
                multiple = _state.multiple,
                contentType = _state.contentType;


            var mainClasses = (0, _classnames2.default)(_JiveTilePlacePicker2.default.main, 'anrom-jive-osapi-picker', {
                multiple: multiple
            });

            return _react2.default.createElement(
                'div',
                { className: mainClasses },
                _react2.default.createElement(
                    'div',
                    { className: 'selected-items selected-' + contentType + 's' },
                    items.map(function (item, i) {
                        return _react2.default.createElement(
                            'div',
                            { key: i },
                            _react2.default.createElement(
                                'span',
                                { className: 'selected' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'name' },
                                    item.name
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
                (multiple || !items.length) && _react2.default.createElement(
                    'button',
                    { onClick: this.callPicker.bind(this), disabled: this.props.limit && items.length >= this.props.limit },
                    this.props.buttonTitle
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
        value: function add(item) {
            var _this4 = this;

            var _state2 = this.state,
                contentType = _state2.contentType,
                items = _state2.items;


            if (this.props.onItemSelect) {
                this.props.onItemSelect(item);
            }

            var filterFields = this.props.filterFields || this.filterFields.bind(this);

            var idField = {
                "place": "placeID",
                "content": "contentID",
                "people": "id"
            };

            var itemExists = items.findIndex(function (targetItem) {
                return targetItem.id == item[idField[contentType]];
            }) != -1;

            if (!itemExists) {
                this.setState((0, _reactAddonsUpdate2.default)(this.state, {
                    items: { $push: [filterFields(item)] }
                }), function () {
                    return _this4.onChange();
                });
            }
        }
    }, {
        key: 'filterFields',
        value: function filterFields(item) {
            var contentType = this.state.contentType;
            var resources = item.resources,
                name = item.name,
                subject = item.subject,
                contentID = item.contentID,
                placeID = item.placeID,
                id = item.id;


            switch (contentType) {
                case 'place':
                    return {
                        name: name,
                        id: placeID,
                        uri: resources.self.ref,
                        html: resources.html.ref
                    };
                case 'content':
                    return {
                        name: subject,
                        id: contentID,
                        uri: resources.self.ref,
                        html: resources.html.ref
                    };
                case 'people':
                    return {
                        name: name.formatted,
                        id: id,
                        uri: resources.self.ref,
                        html: resources.html.ref
                    };
            }
        }
    }, {
        key: 'remove',
        value: function remove(e, i) {
            var _this5 = this;

            if (e !== undefined) e.preventDefault();

            this.setState((0, _reactAddonsUpdate2.default)(this.state, {
                items: { $splice: [[i, 1]] }
            }), function () {
                return _this5.onChange();
            });
        }
    }, {
        key: 'onChange',
        value: function onChange() {
            var _state3 = this.state,
                items = _state3.items,
                multiple = _state3.multiple;


            var output = void 0;

            if (items.length) {
                output = multiple ? items : items[0];
            } else {
                output = multiple ? [] : this.props.default || false;
            }

            this.props.onChange(output);
        }
    }]);

    return JiveSelector;
}(_react.Component);

JiveSelector.propTypes = {
    value: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),

    contentType: _propTypes2.default.oneOf(['place', 'people', 'content']),

    limit: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),

    buttonTitle: _propTypes2.default.node,

    onItemSelect: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),

    filterFields: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),

    onChange: _propTypes2.default.func
};
JiveSelector.defaultProps = {
    value: [],
    contentType: 'place',
    limit: false,
    buttonTitle: 'Add item',
    onItemSelect: false,
    filterFields: false,
    onChange: function onChange() {}
};
exports.default = JiveSelector;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map