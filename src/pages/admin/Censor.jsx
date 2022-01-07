import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import React, { useEffect, useState } from "react";
import { isAddress } from "@ethersproject/address";
import {
  addCensor,
  deleteCensor,
  editCensor,
  getCensors,
} from "utils/getCertContract";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";

const CensorItem = ({
  idx,
  censor,
  showEditModal,
  setRefresh,
  handleCloseModal,
}) => {
  const { account, library } = useActiveWeb3React();

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (idx) => {
    try {
      if (!account || !library || typeof idx !== "number" || deleting) return;

      setDeleting(true);
      await deleteCensor(library, account, [idx]);

      setRefresh((pre) => !pre);
      setDeleting(false);
      handleCloseModal();
    } catch (error) {
      setDeleting(false);
      console.error(error);
    }
  };

  return (
    <Tr>
      <Td>{idx + 1}</Td>
      <Td>{censor.name}</Td>
      <Td>{censor.email}</Td>
      <Td>{censor.addr}</Td>
      <Td isNumeric>
        <Button
          colorScheme="teal"
          mr="2"
          onClick={() => showEditModal(censor, idx)}
        >
          Sửa
        </Button>
        <Button
          colorScheme="red"
          isLoading={deleting}
          onClick={() => handleDelete(idx)}
        >
          Xóa
        </Button>
      </Td>
    </Tr>
  );
};

const Censor = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, library } = useActiveWeb3React();

  const [refresh, setRefresh] = useState(true);
  const [censors, setCensor] = useState([]);
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCensor, setSelectedCensor] = useState();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (library) getCensors(library).then(setCensor).catch(console.error);
  }, [library, refresh]);

  const handleAddCensor = async () => {
    try {
      if (!account || !library) return;
      if (!addr || !name || !email)
        return alert("Điền tất cả các trường bắt buộc");

      if (!isAddress(addr)) return alert("Điền địa chỉ ví");
      setSubmitting(true);
      if (selectedCensor) {
        await editCensor(library, account, [
          selectedCensor.idx,
          addr,
          name,
          email,
        ]);
      } else {
        await addCensor(library, account, [addr, name, email]);
      }

      setRefresh((pre) => !pre);

      setSubmitting(false);
      handleCloseModal();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const showEditModal = (censor, idx) => {
    const { name, email, addr } = censor;
    setName(name);
    setEmail(email);
    setAddr(addr);
    setSelectedCensor({ censor, idx });
  };

  useEffect(() => {
    if (selectedCensor) {
      onOpen();
    }
  }, [selectedCensor]);

  const handleCloseModal = () => {
    if (selectedCensor) setSelectedCensor(undefined);
    setAddr("");
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCensor ? "Sửa" : "Thêm kiểm duyệt viên"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <FormControl isRequired>
                <FormLabel>Tên</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  placeholder="Name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  placeholder="Email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Địa chỉ ví</FormLabel>
                <Input
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  name="address"
                  placeholder="Address"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleAddCensor}
              isLoading={submitting}
            >
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button colorScheme="teal" onClick={onOpen}>
        Thêm
      </Button>
      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên</Th>
            <Th>Email</Th>
            <Th>Địa chỉ ví</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {censors.map((censor, idx) => (
            <CensorItem
              key={idx}
              idx={idx}
              censor={censor}
              showEditModal={showEditModal}
              setRefresh={setRefresh}
              handleCloseModal={handleCloseModal}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Censor;
