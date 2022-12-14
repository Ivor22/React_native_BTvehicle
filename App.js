import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ToastAndroid,
  Image
} from 'react-native';
var _ = require('lodash');
const timer = require('react-native-timer');
import BluetoothSerial from 'react-native-bluetooth-serial'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
      counterP: 1,
      counterS: 1,
      counterT: 0,
      timer: null,
      rotation: 45
    }
  }

 
  componentDidMount(){
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      let timer = setInterval(this.tick2, 400);
      this.setState({timer});

      const [ isEnabled, devices ] = values

      this.setState({ isEnabled, devices })
    })

    BluetoothSerial.on('bluetoothEnabled', () => {

      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({  devices })
      })

      BluetoothSerial.on('bluetoothDisabled', () => {

         this.setState({ devices: [] })

      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))

    })
  }
  
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);
      
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
    })
    .catch((err) => console.log((err.message)))
  }
  _renderItem(item){

    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={styles.deviceNameWrap}>
              <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
            </View>
          </TouchableOpacity>)
  }
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }
  discoverAvailableDevices () {
    
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        this.setState({ unpairedDevices: uniqueDevices, discovering: false })
      })
      .catch((err) => console.log(err.message))
    }
  }

  tick2 =() => {
    
    BluetoothSerial.readFromDevice().then((data) => {
      if(data == ""){
      console.log("prazan");  
      }
      else {
        if (data.includes("\r") ){
          var pieces = data.split(",");
          var length = pieces.length;
          if (length==4){
      console.log("#ARRAY=",length)
      console.log(JSON.stringify(data));
      console.log("PIECES",pieces);
      this.setState({ 
        textToDisplay0: pieces[0],
        textToDisplay1: pieces[1],
        textToDisplay2: pieces[2],
        textToDisplay3: pieces[3],
        rotation: pieces[2] 
      
      
      
      });
    }
      }
     }
    }    
  ) 
}

  tick =() => {
    this.setState({
      counterT: this.state.counterT + 1
    });
  }


  onIncrementP = () => {
    this.setState({
      counterP: this.state.counterP + 1,
    })
  }
  onIncrementS = () => {
    this.setState({
      counterS: this.state.counterS + 1,
    })
  }
  toggleSwitchPRED(){
    if (this.state.counterP == '2'){
      BluetoothSerial.write("i")
      .then((res) => {
        this.setState({ connected: true })
      })
      .catch((err) => console.log(err.message))
      console.log('Successfuly wrote to device i'),
      this.setState({
        counterP: 1,
      })
    }
    if (this.state.counterP == '1'){
      BluetoothSerial.write("o")
      .then((res) => {
        this.setState({ connected: true })
      })
      .catch((err) => console.log(err.message))
      console.log('Successfuly wrote to device o'),
      this.setState({
        counterP: 2,
      })
    }

    
  }
  toggleSwitchSTRAZ(){
    if (this.state.counterS == '2'){
      BluetoothSerial.write("x")
      .then((res) => {
        this.setState({ connected: true })
      })
      .catch((err) => console.log(err.message))
      console.log('Successfuly wrote to device x'),
      this.setState({
        counterS: 1,
      })
    }
    if (this.state.counterS == '1'){
      BluetoothSerial.write("y")
      .then((res) => {
        this.setState({ connected: true })
      })
      .catch((err) => console.log(err.message))
      console.log('Successfuly wrote to device y'),
      this.setState({
        counterS: 2,
      })
    }
  }
  toggleSwitchN(){
    BluetoothSerial.write("N")
    .then((res) => {
      console.log('Successfuly wrote to device N')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  toggleSwitchI(){
    BluetoothSerial.write("I")
    .then((res) => {
      console.log('Successfuly wrote to device I')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  toggleSwitchSTOP(){
    BluetoothSerial.write("S")
    .then((res) => {
      console.log('Successfuly wrote to device S')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  toggleSwitchL(){
    BluetoothSerial.write("L")
    .then((res) => {
      console.log('Successfuly wrote to device L')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  toggleSwitchD(){
    BluetoothSerial.write("D")
    .then((res) => {
      console.log('Successfuly wrote to device D')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  render() {
    const { textToDisplay0,textToDisplay1,textToDisplay2,textToDisplay3 } = this.state;
   //this.BTULTRA();
   /*this.showMsg();*/
    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
            <View style={styles.toolbarButton}>
              <Switch
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
              />
            </View>
      </View>
                <Button
                  onPress={this.discoverAvailableDevices.bind(this)}
                  title="Scan for Devices"
                  color="#841584"
                />
                <FlatList
                  style={{flex:1, borderWidth: 8, 
                    borderRadius: 10,
                    borderColor: 'green'}}
                  data={this.state.devices}
                  keyExtractor={item => item.id}
                  renderItem={(item) => this._renderItem(item)}
                />
       {/* <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => requestAnimationFrame(() => this.showMsg())}>
            <Text>Press Me</Text>
          </TouchableOpacity>
  
          {this.state.showMsg ? (
            <Text>Hello!!</Text>
          ) : (
            null
          )}
          </View> 
        <View style={{flex: 1}}>
        <Text>{this.state.counterT}</Text>
        </View>*/}
                          <Image style={{flex: 1, width: null,
            height: null,
            resizeMode: 'contain',
          transform: [{ rotate: this.state.rotation+'deg' }]}} 
            source={require('./static/arwN.png')} />
        <View style={{       borderWidth: 2, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 5,
       backgroundColor: '#FFEB3B',
       height:100}}>
          <Text > Podaci senzora </Text>
          <Text><Text>ULTRA:{textToDisplay0}</Text><Text> X:{textToDisplay1}</Text><Text> Y:{textToDisplay2}</Text><Text> Z:{textToDisplay3}</Text></Text>

        </View>
        <View style={{flex: 4,  borderWidth: 8, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 5,
       backgroundColor: '#FFEB3B'}}>
         <View style={{flex: 1, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 5}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                  }}
                  onPressIn={this.toggleSwitchN.bind(this)}
                  onPressOut={this.toggleSwitchSTOP.bind(this)}
                >
                  <Image style={{flex: 1, width: null,
            height: null,
            resizeMode: 'contain'}} source={require('./static/arwN.png')} />
                </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 50}}>
        <View style={{flex: 1, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 1

       }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                  onPressIn={this.toggleSwitchL.bind(this)}
                  onPressOut={this.toggleSwitchSTOP.bind(this)}
                >
                <Image style={{flex: 1, width: null,
            height: null,
            resizeMode: 'contain'}} source={require('./static/arwL.png')} />
                </TouchableOpacity>
        </View>
        <View style={{flex: 2, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 1,
       alignItems:'center'}}>
        <Image style={{flex: 1,resizeMode:'center', height:150}} source={require('./static/bager.png')} />
                     </View> 
        <View style={{flex: 1, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 1}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                  onPressIn={this.toggleSwitchD.bind(this)}
                  onPressOut={this.toggleSwitchSTOP.bind(this)}
                >
                <Image style={{flex: 1, width: null,
            height: null,
            resizeMode: 'contain'}} source={require('./static/arwD.png')} />
                </TouchableOpacity>
        </View>
        </View>
        <View style={{flex: 1, flexDirection:'row',  borderWidth: 1, 
       borderRadius: 10,
       borderColor: '#E91E63',
       padding: 5}}>
                <TouchableOpacity
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                            }}
                  onPressIn={this.toggleSwitchI.bind(this)}
                  onPressOut={this.toggleSwitchSTOP.bind(this)}
                >
                <Image style={{flex: 1,    width: null,
                height: null,
                resizeMode: 'contain'}} source={require('./static/arwI.png')} />
                </TouchableOpacity>
        </View>
        <View style={{
            flex: 1,
            flexDirection: 'row',  borderWidth: 1, 
            borderRadius: 10,
            borderColor: '#E91E63',
            padding: 5,

          }}>
                <TouchableWithoutFeedback
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                            }}
                  onPressIn={this.toggleSwitchPRED.bind(this)}
                >
                  {this.state.counterP == 2? <Image style={{flex: 1, width: null,
                height: null,
                resizeMode:'contain'
                }} 
                source={require('./static/on.png')} />: 
                <Image style={{flex: 1, width: null,
                  height: null,
                  resizeMode:'contain',
                  
                  }} 
                  source={require('./static/off.png')} /> }
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                            }}
                  onPressIn={this.toggleSwitchSTRAZ.bind(this)}
                >
                  {this.state.counterS == 2? <Image style={{flex: 1, width: null,
                height: null,
                resizeMode:'contain'
                }} 
                source={require('./static/on.png')} />: 
                <Image style={{flex: 1, width: null,
                  height: null,
                  resizeMode:'contain'
                  }} 
                  source={require('./static/off.png')} /> }       
                </TouchableWithoutFeedback>
        </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  }
});
