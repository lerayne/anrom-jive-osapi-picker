/**
 * Created by M. Yegorov on 2016-10-25.
 */

import React, {Component} from 'react';
import update from 'react-addons-update';
import PropTypes from 'prop-types'
import classnames from 'classnames';

import osapi from 'jive/osapi';

import css from './JiveTilePlacePicker.css'

export default class JiveSelector extends Component {

    static propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),

        contentType: PropTypes.oneOf(['place', 'people', 'content']),

        limit: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.number
        ]),

        buttonTitle: PropTypes.node,

        onItemSelect: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),

        filterFields: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),

        onChange: PropTypes.func
    }

    static defaultProps = {
        value:[],
        contentType: 'place',
        limit: false,
        buttonTitle: 'Add item',
        onItemSelect: false,
        filterFields: false,
        onChange: function(){}
    }

    constructor(props){
        super(props);

        const {value} = props;
        const isArray = props.value.length !== undefined

        this.state = {
            items: props.value ? (isArray ? value : (value.id > 0 ? [value] : [])) : [],
            multiple: isArray,
            contentType: props.contentType
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.value !== newProps.value){

            const isArray = newProps.value.length !== undefined

            this.setState({
                items: isArray ? newProps.value : (newProps.value.id > 0 ? [newProps.value] : [])
            })
        }
    }

    render() {

        const {items, multiple, contentType} = this.state;

        const mainClasses = classnames(css.main, 'anrom-jive-osapi-picker', {
            multiple
        });

        return <div className={mainClasses}>
            <div className={`selected-items selected-${contentType}s`}>
                {items.map((item, i) =>
                    <div key={i}>
                        <span className="selected">
                            <span className="name">{item.name}</span>
                            <a className="remove" onClick={e => this.remove(e, i)}>&times;</a>
                        </span>
                    </div>
                )}
            </div>

            {(multiple || !items.length) && <button onClick={::this.callPicker} disabled={this.props.limit && items.length >= this.props.limit}>
                {this.props.buttonTitle}
            </button>}
        </div>
    }

    callPicker(e) {
        e.preventDefault();

        const {contentType} = this.state

        osapi.jive.corev3.search.requestPicker({
            excludeContent: contentType == 'people' || contentType == 'place',
            excludePlaces: contentType == 'people' || contentType == 'content',
            excludePeople: contentType == 'content' || contentType == 'place',
            success: data => this.add(data),
            error: data => {
                console.error('error: ' + JSON.stringify(data));
            }
        });
    }

    add(item){
        const {contentType, items} = this.state

        if (this.props.onItemSelect){
            this.props.onItemSelect(item)
        }

        const filterFields = this.props.filterFields || ::this.filterFields

        const idField = {
            "place": "placeID",
            "content": "contentID",
            "people": "id"
        }

        const itemExists = items.findIndex(targetItem => targetItem.id == item[idField[contentType]]) != -1;

        if (!itemExists){
            this.setState(update(this.state, {
                items: {$push: [filterFields(item)]}
            }), () => this.onChange())
        }
    }
    
    filterFields(item){
        const {contentType} = this.state
        const {resources, name, subject, contentID, placeID, id} = item;

        switch (contentType){
            case 'place':
                return {
                    name,
                    id: placeID,
                    uri: resources.self.ref,
                    html: resources.html.ref
                }
            case 'content':
                return {
                    name: subject,
                    id: contentID,
                    uri: resources.self.ref,
                    html: resources.html.ref
                }
            case 'people':
                return {
                    name: name.formatted,
                    id,
                    uri: resources.self.ref,
                    html: resources.html.ref
                }
        }
    }

    remove(e, i) {
        if (e !== undefined) e.preventDefault()

        this.setState(update(this.state, {
            items: {$splice: [[i,1]]}
        }), () => this.onChange())
    }

    onChange(){
        const {items, multiple} = this.state;

        let output;

        if (items.length){
            output = multiple ? items : items[0]
        } else {
            output = multiple ? [] : this.props.default || false
        }

        this.props.onChange(output)
    }
}