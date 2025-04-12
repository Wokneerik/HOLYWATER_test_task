import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 18,
    letterSpacing: -0.41,
    color: '#0B080F',
    fontWeight: 700,
  },
  infoLabel: {
    fontSize: 12,
    color: '#D9D5D6',
    letterSpacing: -0.41,
    fontWeight: 600,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 15,
  },
  summaryBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.41,
    fontWeight: 700,
    color: '#0B080F',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    letterSpacing: 0.15,
    fontWeight: 400,
    color: '#393637',
    lineHeight: 22,
  },
  loadingText: {
    padding: 20,
    textAlign: 'center',
    color: 'black',
  },
  errorText: {
    padding: 20,
    textAlign: 'center',
    color: 'red',
  },
  noBookText: {
    padding: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default styles;
