import React, { useState, useContext, useEffect } from 'react';
import { Color } from '../../utils/color';
import {
  NativeModules,
  View
} from 'react-native';
import { loginAction } from '../../redux/reducer/login/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navigation from '../../helper/rootNavigation';
import styles from './styles';
import { Button, InputText, Label } from '../../components';
import { LanguageContext } from '../../router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '../../components/ui/logo';
import { isValidate, validation } from '../../utils/validationUtils';
import Header from '../../components/ui/header';
import Link from '../../components/ui/link';
import Routes from '../../router/routes';
import { requestUserPermission } from '../../utils/notificationService';
import { setFirebaseToken } from '../../redux/reducer/common/action';
import DeviceInfo from 'react-native-device-info';
import config from '../../../config';
import { Loading } from '../../../App';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
const { RNModules } = NativeModules;
const mapStateToProps = (state: any) => {
  return {
    login: state.login,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      loginAction, setFirebaseToken
    },
    dispatch
  );

const Login = (props: any) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setformError] = useState({ email: null, password: null });
  const { language } = useContext(LanguageContext);
  const { setLoading } = useContext(Loading);
  const { firebaseToken } = props.common;
  const isFocused = useIsFocused();
  useEffect(() => {
    requestUserPermission((token: String) => {
      props.setFirebaseToken(token);
    });
    setTimeout(() => {
      RNModules.hide();
    }, 1000);
    if(isFocused){ 
      setformError({ email: null, password: null })
  }
  }, [isFocused])

  const login = () => {
    let error = { email: validation('email', form.email), password: validation('password', form.password) }
    setformError(error);
    let deiviceId = DeviceInfo.getDeviceId();
    console.log("token=",firebaseToken);
    let param = {
      "userTimeZone": config.TIME_ZONE,
      "deviceType": "mobile",
      "deviceId": deiviceId,
      "deviceToken": firebaseToken
    }
    if (isValidate(error)) {
      setLoading(true);
      props.loginAction({ ...form, ...param }, () => {
        setLoading(false);
      });
    }

  };

  return (
    <Header>
      <View style={styles.subContainer}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableResetScrollToCoords={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.imgContainer}>
            <Logo />
          </View>
          <View>
            <Label xlarge align="center" color="#000" style={styles.textContainer}>
              Sign in to your account
            </Label>
          </View>

          <View style={styles.mainContainer}>
            <InputText
              name={`${language.emailField} *`}
              type="email"
              error={formError.email}
              placeholder={`${language.emailField}`}
              onChangeText={(email: string) => {
                setForm({ ...form, email });
                setformError({ ...formError, email: validation("email", email) });
              }
              }
              value={form.email}
            />
            <InputText
              name={`${language.password} *`}
              placeholder={`${language.password}`}
              type="password"
              maxLength={50}
              eyeColor={Color.EYE_COLOR}
              error={formError.password}
              onChangeText={(password: string) => {
                setForm({ ...form, password });
                setformError({ ...formError, password: validation("password", password) });
              }}
              secureTextEntry={true}
            />
          </View>
          <Link
            align="right"
            onPress={() => Navigation.navigate({ route: Routes.ForgotPassword })}
          >
            {language.forgotPassword} ?
          </Link>

          <View style={styles.button}>
            <Button name={language.login} onPress={login}  />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Header>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
