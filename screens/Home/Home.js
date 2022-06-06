import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { FONTS, SIZES, COLORS, icons, dummyData } from "../../constants";
import { HorizontalFoodCard, VerticalFoodCard } from "../../components";
import FilterModal from "./FilterModal";
import Animated from "react-native-reanimated";
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Section = ({ title, onPress, children }) => {
  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: SIZES.padding,
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <Text style={{ flex: 1, ...FONTS.h3 }}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: COLORS.primary, ...FONTS.body3 }}>
            Showw All
          </Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      {children}
    </View>
  );
};

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [selectedMenuType, setSelectedMenuType] = useState(1);
  const [popular, setPopular] = useState([]);
  const [recommends, setRecommends] = useState([]);
  const [menuList, setMenuList] = useState([]);

  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    handleChangeCategory(selectedCategoryId, selectedMenuType);
  }, []);

  //   Handler

  function handleChangeCategory(categoryId, menuTypeId) {
    //Retrieve the popular menu
    let selectedPopular = dummyData.menu.find((a) => a.name == "Popular");

    //Retrieve the recommended menu
    let selectedRecommend = dummyData.menu.find((a) => a.name == "Recommended");

    // Find the menu based on the menuTypeId
    let selectedMenu = dummyData.menu.find((a) => a.id == menuTypeId);

    // Set the popular menu based on the categoryId
    setPopular(
      selectedPopular?.list.filter((a) => a.categories.includes(categoryId))
    );
    // Set the recommended menu based on the categoryId
    setRecommends(
      selectedRecommend?.list.filter((a) => a.categories.includes(categoryId))
    );

    // Set the menu basedon the categoryId
    setMenuList(
      selectedMenu?.list.filter((a) => a.categories.includes(categoryId))
    );
  }

  //   Render
  console.log("showFilterModal>>>", showFilterModal);
  function renderSearch() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          alignItems: "center",
          marginHorizontal: SIZES.padding,
          marginVertical: SIZES.base,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}
      >
        {/* Icon */}
        <Image
          source={icons.search}
          style={{
            height: 20,
            width: 20,
            tintColor: COLORS.black,
          }}
        />
        {/* Text Input */}
        <TextInput
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            ...FONTS.body3,
            textAlignVertical: "center",
          }}
          placeholder="search food..."
        />
        {/* Filter Button */}

        <TouchableOpacity
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
          }}
          onPress={() => {
            console.log("called show modal!");
            setShowFilterModal(true);
          }}
        >
          <Image
            source={icons.filter}
            style={{ height: 20, width: 20, tintColor: COLORS.black }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderMenuTypes() {
    return (
      <FlatList
        overScrollMode={"never"}
        horizontal
        data={dummyData.menu}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 30,
          marginBottom: 20,
        }}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            style={{
              marginLeft: SIZES.padding,
              marginRight:
                index == dummyData.menu.length - 1 ? SIZES.padding : 0,
            }}
            onPress={() => {
              setSelectedMenuType(item.id);
              handleChangeCategory(selectedCategoryId, item.id);
            }}
          >
            <Text
              style={{
                color:
                  selectedMenuType == item.id ? COLORS.primary : COLORS.black,
                ...FONTS.h3,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }
  function renderRecommendedSection() {
    return (
      <Section
        title="Recommended"
        onPress={() => console.log("Show all recommended")}
      >
        <FlatList
          overScrollMode={"never"}
          data={recommends}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate={"fast"}
          pagingEnabled={false}
          snapToInterval={Dimensions.get("window").width - SIZES.width * 0.32}
          renderItem={({ item, index }) => {
            return (
              <HorizontalFoodCard
                containerStyle={{
                  height: 180,
                  width: SIZES.width * 0.7,
                  marginLeft: index == 0 ? SIZES.padding : 18,
                  marginRight:
                    index == recommends.length - 1 ? SIZES.padding : 0,
                  paddingRight: SIZES.radius,
                  alignItems: "center",
                  paddingVertical: 20,

                  overScrollMode: "never",
                }}
                customDescriptionStyle={{
                  flex: 1,
                  textAlignVertical: "center",
                }}
                imageStyle={{ marginTop: 35, height: 150, width: 150 }}
                item={item}
                onPress={() => console.log("HorizontalFoodCard")}
              />
            );
          }}
        />
      </Section>
    );
  }

  function renderPopularSection() {
    return (
      <Section
        title={"Popular Near You"}
        onPress={() => console.log("Show all popular items ")}
      >
        <FlatList
          overScrollMode={"never"}
          data={popular}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <VerticalFoodCard
              containerStyle={{
                marginLeft: index == 0 ? SIZES.padding : 18,
                marginRight: index == popular.length - 1 ? SIZES.padding : 0,
                paddingRight: SIZES.radius,
              }}
              item={item}
              onPress={() => console.log("Vertical Food Card")}
            />
          )}
        />
      </Section>
    );
  }

  function renderFoodCategories() {
    return (
      <FlatList
        overScrollMode={"never"}
        data={dummyData.categories}
        keyExtractor={(item) => `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              height: 55,
              marginTop: SIZES.padding,
              marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
              marginRight:
                index == dummyData.categories.length - 1 ? SIZES.padding : 0,
              paddingHorizontal: 8,
              borderRadius: SIZES.radius,
              backgroundColor:
                selectedCategoryId == item.id
                  ? COLORS.primary
                  : COLORS.lightGray2,
            }}
            onPress={() => {
              setSelectedCategoryId(item.id);
              handleChangeCategory(item.id, selectedMenuType);
            }}
          >
            <Image
              source={item.icon}
              style={{ marginTop: 5, height: 50, width: 50 }}
            />
            <Text
              style={{
                alignSelf: "center",
                marginRight: SIZES.base,
                ...FONTS.h3,
                color:
                  selectedCategoryId == item.id
                    ? COLORS.white
                    : COLORS.darkGray,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }

  function renderDeliveryTo() {
    return (
      <View
        style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}
      >
        <Text style={{ color: COLORS.primary, ...FONTS.body3 }}>
          Delivery To
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginTop: SIZES.base,
            alignItems: "center",
          }}
        >
          <Text style={{ ...FONTS.h3 }}>{dummyData?.myProfile?.address}</Text>
          <Image
            source={icons.down_arrow}
            style={{ marginLeft: SIZES.base, height: 20, width: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* Search */}
      {renderSearch()}
      {/* Filter */}
      {showFilterModal && (
        <FilterModal
          isVisible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
        />
      )}
      {/* List */}
      <FlatList
        overScrollMode={"never"}
        data={menuList}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Delivery To */}
            {renderDeliveryTo()}
            {/* Food categories */}
            {renderFoodCategories()}
            {/* Popular */}
            {renderPopularSection()}
            {/* Recommended */}
            {renderRecommendedSection()}
            {/* Menu Type */}
            {renderMenuTypes()}
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <HorizontalFoodCard
              containerStyle={{
                height: 130,
                alignItems: "center",
                marginHorizontal: SIZES.padding,
                marginBottom: SIZES.radius,
              }}
              imageStyle={{ marginTop: 20, height: 110, width: 110 }}
              item={item}
              onPress={() => console.log("HorizontalFoodCard")}
            />
          );
        }}
        ListFooterComponent={<View style={{ height: 200 }} />}
      />
    </View>
  );
};

export default Home;
