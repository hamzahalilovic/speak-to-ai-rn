// import React, {createContext, useContext, useState} from 'react';
// import {GluestackUIProvider, extendTheme} from '@gluestack-ui/themed';

// // Create a context for the theme
// const ThemeContext = createContext();

// export const useThemeContext = () => useContext(ThemeContext);

// // Custom themes
// const lightTheme = {
//   colors: {
//     primary: {
//       50: '#E3F2F9',
//       100: '#C5E4F3',
//       200: '#A2D4EC',
//       300: '#7AC1E4',
//       400: '#47A9DA',
//       500: '#0088CC',
//       600: '#007AB8',
//       700: '#006BA1',
//       800: '#005885',
//       900: '#003F5E',
//     },
//     background: '#ffffff',
//     text: '#000000',
//   },
// };

// const darkTheme = {
//   colors: {
//     primary: {
//       50: '#2a2a2a',
//       100: '#333333',
//       200: '#3c3c3c',
//       300: '#454545',
//       400: '#4e4e4e',
//       500: '#575757',
//       600: '#606060',
//       700: '#696969',
//       800: '#727272',
//       900: '#7b7b7b',
//     },
//     background: '#000000',
//     text: '#ffffff',
//   },
// };

// export const ThemeProvider = ({children}) => {
//   const [theme, setTheme] = useState(lightTheme);

//   const toggleTheme = () => {
//     setTheme(prevTheme => (prevTheme === lightTheme ? darkTheme : lightTheme));
//   };

//   return (
//     <ThemeContext.Provider value={{theme, toggleTheme}}>
//       <GluestackUIProvider theme={theme}>{children}</GluestackUIProvider>
//     </ThemeContext.Provider>
//   );
// };
