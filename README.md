# anrom-jive-osapi-picker

### Requirements
* `osapi` global variable have to be exported as `'jive/osapi'` in webpack externals
* webpack should be configured to proces CSS files with `style-loader!css-loader` rule

## Installation

### npm
`npm install -S anrom-jive-osapi-picker`

## Usage
```javascript
<JivePlaceSelector
    buttonTitle="Добавить блог"
    value={this.state.places}
    onChange={places => {
        this.updateState({places:{$set:places}})
    }}
/>
```