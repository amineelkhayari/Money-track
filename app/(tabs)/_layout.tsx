import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#333",
        headerShown: true,
      }}>
         <Tabs.Screen
        name="transaction"  
      
        options={{
          headerTitle:"aa",
          headerShown:false,
          title: 'History',
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-circle"
                    size={40}
                    color="#333"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
     
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color }) => <MaterialIcons name="category" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="subCategory"
        options={{
          title: 'Sub Category',
          tabBarIcon: ({ color }) => <MaterialIcons name="category" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="importData"
        options={{
          title: 'Import Data',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="database-import-outline" size={24} color="black" />

          ,
        }}
      />
    </Tabs>
  );
}
