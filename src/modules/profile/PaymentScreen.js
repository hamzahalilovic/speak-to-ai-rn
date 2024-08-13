import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Spinner,
} from '@gluestack-ui/themed-native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as RNIap from 'react-native-iap';

const itemSkus = ['com.example.premium'];

const PaymentScreen = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Initialize the IAP connection
    RNIap.initConnection()
      .then(() => {
        // Get available products
        return RNIap.getProducts(itemSkus);
      })
      .then(products => {
        setProducts(products);
      })
      .catch(error => {
        console.warn('Error initializing IAP connection', error);
      });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const purchase = await RNIap.requestPurchase(itemSkus[0]);
      setLoading(false);
      Alert.alert('Purchase Successful', 'Thank you for your purchase!');
      // Handle successful purchase (e.g., update user subscription status)
    } catch (err) {
      setLoading(false);
      if (err.code === 'E_USER_CANCELLED') {
        Alert.alert('Purchase Cancelled', 'You cancelled the purchase.');
      } else {
        Alert.alert('Purchase Failed', 'Something went wrong.');
      }
    }
  };

  return (
    <View style={{flex: 1, padding: 16, backgroundColor: '#fff'}}>
      <Text fontSize={24} fontWeight={600} mb={4}>
        Payment Screen
      </Text>
      <VStack space={4}>
        {products.length > 0 ? (
          <Box
            padding={4}
            backgroundColor="#f5f5f5"
            borderRadius="10px"
            alignItems="center">
            <HStack space={3} alignItems="center">
              <Icon as={Ionicons} name="cash-outline" size="lg" />
              <Text fontSize={16} fontWeight="bold">
                Purchase Premium Subscription
              </Text>
            </HStack>
            <Text fontSize={14} mt={2} color="gray.500" textAlign="center">
              Unlock all premium features and content with a one-time purchase.
            </Text>
            <Button
              mt={4}
              onPress={handlePurchase}
              backgroundColor="green.500"
              _text={{color: '#fff'}}
              isDisabled={loading}>
              {loading ? (
                <Spinner color="white" />
              ) : (
                `Buy for ${products[0].localizedPrice}`
              )}
            </Button>
          </Box>
        ) : (
          <Spinner color="gray.500" />
        )}
      </VStack>
    </View>
  );
};

export default PaymentScreen;
