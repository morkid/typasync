import React, {Component} from 'react';
import {Text, TextInput, View, ListView} from 'react-native';
import {TypAsync} from './typasync';

const ds = new ListView.DataSource({rowHasChanged: (a, b) => (a.alpha2Code !== a.alpha2Code ? 1 : -1)});
const restCountryUrl = 'https://restcountries.eu/rest/v2/name/{name}';

export default class ReactNativeDemo extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    this.typing = new TypAsync({
      timeout: 1000,
      processing: true
    });

    this.typing
      .on('change', (value, complete) => this.getData(value, complete))
      .on('empty', () => this.getData([], () => {}));
  }

  getData(value, callback) {
    var url = restCountryUrl.replace(/\{name\}/, value);
    fetch(url)
    .then(res => res.json())
    .then(json => this.applyData(json, callback))
    .catch(e => this.applyData([], callback));
  }

  applyData(json, complete) {
    console.log('total countries found: ' + json.length)
    this.setState({dataSource: ds.cloneWithRows(json)});
    complete();
  }

  renderRow(row) {
    return <Text>{row.name + ' (' + row.alpha2Code + ')'}</Text>
  }

  render() {
    return <View>
        <TextInput onChangeText={this.typing.change.bind(this.typing)}/>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}/>
      </View>
  }
}