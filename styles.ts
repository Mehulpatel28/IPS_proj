import { StyleSheet } from 'react-native'
import responsive from '../../helper/responsive';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FB',
        justifyContent:"center"
    },
    subContainer: {
        alignItems: 'center'
    },
    imgContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: responsive.relativeHeight(3)
    },
    textContainer: {
        fontWeight: '700',
    },
    mainContainer: {
        flex: 2,
        marginTop: responsive.relativeHeight(8)
    },
    button: {
        flex: 3,
        marginVertical: responsive.relativeHeight(5)
    },
})

export default styles;

