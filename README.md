# anrom-jive-osapi-picker

### Requirements
* `osapi` global variable have to be exported as `'jive/osapi'` in webpack externals
* webpack should be configured to proces CSS files with `style-loader!css-loader` rule

## Installation

### npm
`npm install -S anrom-jive-osapi-picker`

## Usage
Usage example:
```jsx

import React from 'react'
import JiveSelector from 'anrom-jive-osapi-picker'

export default function Picker(){
    return <JivePlaceSelector
        buttonTitle="Добавить блог"
        contentType="people"
        value={this.state.author}
        onChange={person => this.setState({author: person})}
    />
}
```
### API
#### Component propperties
property | type | default | description
---------|------|---------|------------
**buttonTitle** | string | "Add place" | Sets the add button title 
**contentType** | string | "place" | Defines the type of content that the picker will be handling. *Possible options:* "people", "content"
**value** | object/array |-| Current place/person/content item or the array of specified type. If array given the selector will allow **multiple values** 
**onChange** | function |-| *arguments:* selected item (object). Fires when the selection of an object is performed