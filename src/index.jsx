/**
 * Created by M. Yegorov on 2016-10-25.
 */

import React, {Component} from 'react';
import update from 'react-addons-update';
import classnames from 'classnames';

import osapi from 'jive/osapi';

import css from './JiveTilePlacePicker.css'

export default class JivePlaceSelector extends Component {

    constructor(props){
        super(props);

        const {value} = props;
        const isArray = props.value.length != undefined;

        this.state = {
            places: props.value ? (isArray ? value : (value.id > 0 ? [value] : [])) : [],
            multiple: isArray,
            contentType: props.contentType || 'place'
        }
    }

    render() {

        const {places, multiple, contentType} = this.state;

        const mainClasses = classnames(css.main, 'anrom-jive-osapi-picker', {
            multiple
        });

        return <div className={mainClasses}>
            <div className="selected-places">
                {places.map((item, i) =>
                    <div key={i}>
                        <span className="selected">
                            <span className="name">{item.name}</span>
                            <a className="remove" onClick={e => this.remove(e, i)}>&times;</a>
                        </span>
                    </div>
                )}
            </div>

            {(multiple || !places.length) && <button onClick={::this.callPicker} disabled={this.props.limit && places.length >= this.props.limit}>
                {this.props.buttonTitle || 'Add place'}
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

    add(place){
        const {contentType} = this.state

        const filterFields = this.props.filterFields || ::this.filterFields;

        let itemExists = true
        if (contentType == 'place'){
            itemExists = this.state.places.findIndex(targetPlace => targetPlace.id == place.placeID) != -1;
        }
        if (contentType == 'content'){
            itemExists = this.state.places.findIndex(targetPlace => targetPlace.id == place.contentID) != -1;
        }
        if (contentType == 'people'){
            itemExists = this.state.places.findIndex(targetPlace => targetPlace.id == place.id) != -1;
        }

        if (!itemExists){
            this.setState(update(this.state, {
                places: {$push: [filterFields(place)]}
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
        e.preventDefault();

        this.setState(update(this.state, {
            places: {$splice: [[i,1]]}
        }), () => this.onChange())
    }

    onChange(){
        if (typeof this.props.onChange == 'function'){

            const {places, multiple} = this.state;

            let output;

            if (places.length){
                output = multiple ? places : places[0]
            } else {
                output = multiple ? [] : this.props.default || false
            }

            this.props.onChange(output)
        }
    }
}