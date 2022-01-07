import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { ROLES } from "configs";
import { GlobalContext } from "context/GlobalContext";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import { FiSearch } from "react-icons/fi";
import Icon from "@chakra-ui/icon";
import { isAddress } from "@ethersproject/address";
import { Heading, Text, Grid, Image } from "@chakra-ui/react";
import avatar from "../assets/images/avatar.png";

const Home = () => {
  const history = useHistory();
  const { isAuthenticated, user } = useContext(GlobalContext);

  const [searchInput, setSearchInput] = useState();

  const handleSearch = () => {
    if (!searchInput || !isAddress(searchInput))
      return alert("Invalid address");

    history.push(`/users/${searchInput}`);
  };

  return (
    <div className="home">
      <div className="search-home">
        <div className="heading-home">
          <Text fontSize="xl" fontSize="40px" mt="4" color="white">
            HỆ THỐNG QUẢN LÝ CHỨNG CHỈ
          </Text>
          <Heading as="h4" size="lg" my="2">
            TỐT NGHIỆP ĐẠI HỌC
          </Heading>
        </div>
        <VStack>
          <Select
            size="lg"
            textTransform="uppercase"
            fontSize="2xl"
            fontWeight="bold"
            borderColor="black"
            _hover={{
              borderColor: "black",
            }}
            _focus={{
              borderColor: "black",
            }}
            onChange={(e) => {
              const roleKey = Object.keys(ROLES).find(
                (k) => ROLES[k].value === +e.target.value
              );
              if (!roleKey) return alert("Invalid Role");
              let path = `/${ROLES[roleKey].name}`;
              if (isAuthenticated) {
                if (ROLES[roleKey].value === ROLES.USER.value) {
                  path = `${path}/${user.account}`;
                }
              } else {
                return alert("Kết nối ví");
              }
              history.push(path);
            }}
            defaultValue=""
          >
            <option
              value=""
              disabled
              hidden
              style={{
                color: "black",
                textTransform: "uppercase",
              }}
            >
              choose your role
            </option>
            {Array.isArray(user?.roles) &&
              Object.keys(ROLES)
                .filter(
                  (r) =>
                    ROLES[r].value === ROLES.USER.value ||
                    user.roles.includes(ROLES[r].value)
                )
                .map((k, idx) => (
                  <option
                    style={{ color: "black", textTransform: "uppercase" }}
                    value={ROLES[k].value}
                    key={idx}
                  >
                    {ROLES[k].name}
                  </option>
                ))}
          </Select>

          <Box>OR</Box>

          <InputGroup>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm chứng chỉ theo địa chỉ ví"
              color="black"
              borderColor="black"
              _placeholder={{ color: "black" }}
            />
            <InputRightElement
              children={
                <Icon onClick={handleSearch} as={FiSearch} cursor="pointer" />
              }
            />
          </InputGroup>
        </VStack>
      </div>
      <div className="contact-home">
        <div className="contact-text">
          <Text fontSize="xl" fontSize="30px" mx="2" color="black">
            LIÊN HỆ VỚI QUẢN TRỊ VIÊN
          </Text>
          <Text fontSize="xl" fontSize="25px" mx="2" color="#c4c4c4">
            Danh sách các quản trị viên hỗ trợ hệ thống
          </Text>
        </div>
        <div className="contact-list">
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Box w="100%" h="100%" className="contact-item">
              <div className="avatar-contact">
                <Image h="20" src={avatar} />
              </div>
              <div className="content-contact">
                <Text fontSize="20px" color="#000" my="2">
                  Trương Hữu Mẫn
                  <span className="textItalic"> Hỗ trợ viên </span>
                  <span className="textBlue">VKU</span>
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Email: thman@vku.udn.vn
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Phone: 0972592842
                </Text>
                {/* <Text fontSize="16px" color="#c4c4c4" my="2">
                  Sinh viên của Đại học Công nghệ thông tin và truyền thông Việt
                  Hàn
                </Text> */}
              </div>
            </Box>
            <Box w="100%" h="100%" className="contact-item">
              <div className="avatar-contact">
                <Image h="20" src={avatar} />
              </div>
              <div className="content-contact">
                <Text fontSize="20px" color="#000" my="2">
                  Nguyễn Đắc Nghĩa
                  <span className="textItalic"> Hỗ trợ viên </span>
                  <span className="textBlue">VKU</span>
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Email: nva@vku.udn.vn
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Phone: 0987654321
                </Text>
                {/* <Text fontSize="16px" color="#c4c4c4" my="2">
                  Sinh viên của Đại học Công nghệ thông tin và truyền thông Việt
                  Hàn
                </Text> */}
              </div>
            </Box>
            <Box w="100%" h="100%" className="contact-item">
              <div className="avatar-contact">
                <Image h="20" src={avatar} />
              </div>
              <div className="content-contact">
                <Text fontSize="20px" color="#000" my="2">
                  Lê Đức Anh<span className="textItalic"> Hỗ trợ viên </span>
                  <span className="textBlue">VKU</span>
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Email: ldanh@vku.udn.vn
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Phone: 0987654456
                </Text>
                {/* <Text fontSize="16px" color="#c4c4c4" my="2">
                  Sinh viên của Đại học Công nghệ thông tin và truyền thông Việt
                  Hàn
                </Text> */}
              </div>
            </Box>
            <Box w="100%" h="100%" className="contact-item">
              <div className="avatar-contact">
                <Image h="20" src={avatar} />
              </div>
              <div className="content-contact">
                <Text fontSize="20px" color="#000" my="2">
                  Trần Bảo Hân<span className="textItalic"> Hỗ trợ viên </span>
                  <span className="textBlue">VKU</span>
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Email: tbhan@vku.udn.vn
                </Text>
                <Text fontSize="16px" color="#c4c4c4" my="2">
                  Phone: 0987654123
                </Text>
                {/* <Text fontSize="16px" color="#c4c4c4" my="2">
                  Sinh viên của Đại học Công nghệ thông tin và truyền thông Việt
                  Hàn
                </Text> */}
              </div>
            </Box>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Home;
