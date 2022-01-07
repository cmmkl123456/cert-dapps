import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { isAddress } from "@ethersproject/address";
import Certificate from "components/Certificate";
import { GENDER, GRADUATE_GRADE, STUDY_MODES } from "configs";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import { uploadIPFS } from "services/upload-ipfs";
import {
  addCert,
  addCertForm,
  addSpecializedTraining,
  deleteCertForm,
  deleteSpecializedTraining,
  getCertForms,
  getCertsMinted,
  getSpecializedTrainings,
} from "utils/getCertContract";

const certMenu = {
  certificateType: "Chuyên ngành đào tạo",
  certificates: "Chứng chỉ",
};

const Cert = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenMint,
    onOpen: onOpenMint,
    onClose: onCloseMint,
  } = useDisclosure();
  const {
    isOpen: isOpenMinted,
    onOpen: onOpenMinted,
    onClose: onCloseMinted,
  } = useDisclosure();
  const { account, library } = useActiveWeb3React();

  const [selectedItem, setSelectedItem] = useState(certMenu.certificates);
  const [refresh, setRefresh] = useState(true);
  const [refreshCert, setRefreshCert] = useState(true);

  const [specializedTrainings, setSpecializedTrainings] = useState([]);
  const [certs, setCerts] = useState([]);
  const [specializedTrainingName, setSpecializedTrainingName] = useState("");
  const [specializedTrainingVnName, setSpecializedTrainingVnName] =
    useState("");

  const [selectedSpecializedTraining, setSelectedSpecializedTraining] =
    useState();
  const [certData, setCertData] = useState({
    specializedTraining: null,
    modeStudy: STUDY_MODES.fullTime,
    total: 1,
    year: new Date().getFullYear(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCertForm, setSelectedCertForm] = useState();
  const [certMintData, setCertMintData] = useState({
    addr: "",
    name: "",
    gender: GENDER.MALE,
    dateOfBirth: "",
    graduateGrade: GRADUATE_GRADE.A,
    mintWhere: "",
  });

  useEffect(() => {
    if (library)
      getSpecializedTrainings(library)
        .then(setSpecializedTrainings)
        .catch(console.error);
  }, [library, refresh]);

  useEffect(() => {
    if (library) getCertForms(library).then(setCerts).catch(console.error);
  }, [library, refreshCert]);

  const handleAddSpecializedTraining = async () => {
    try {
      if (!account || !library) return;
      if (!specializedTrainingName)
        return alert("Điền tất cả các trường bắt buộc");

      setSubmitting(true);
      await addSpecializedTraining(library, account, [
        specializedTrainingName,
        specializedTrainingVnName,
      ]);
      setRefresh((pre) => !pre);
      setSpecializedTrainingName("");
      setSpecializedTrainingVnName("");

      setSubmitting(false);
      onClose();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const handleDeleteSpecializedTraining = async (idx) => {
    try {
      if (!account || !library || typeof idx !== "number") return;

      setDeleting(true);
      await deleteSpecializedTraining(library, account, [idx]);
      setRefresh((pre) => !pre);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.error(error);
    }
  };

  const handleAddCertForm = async () => {
    try {
      if (!account || !library) return;
      if (!certData.specializedTraining)
        return alert("Chọn chuyên ngành đào tạo");

      const { total, ..._certData } = certData;
      setSubmitting(true);
      console.log(_certData);
      const url = await uploadIPFS(_certData);
      await addCertForm(library, account, [url, total]);
      setRefreshCert((pre) => !pre);
      setCertData({
        specializedTraining: null,
        modeStudy: STUDY_MODES.fullTime,
        total: 1,
        year: new Date().getFullYear(),
      });
      setSubmitting(false);
      onClose();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const handleDeleteCertForm = async (idx) => {
    try {
      if (!account || !library || typeof idx !== "number") return;

      setDeleting(true);
      await deleteCertForm(library, account, [idx]);
      setRefreshCert((pre) => !pre);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.error(error);
    }
  };

  const handleSubmit = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return handleAddSpecializedTraining();

      case certMenu.certificates:
        return handleAddCertForm();
    }
  };

  const handleMintCert = async () => {
    try {
      if (!account || !library) return;
      if (!selectedCertForm) return alert("Chọn hình thức đào tạo");
      if (
        !certMintData.name ||
        !certMintData.addr ||
        !certMintData.mintWhere ||
        !certMintData.dateOfBirth
      )
        return alert("Điền tất cả các trường bắt buộc");

      const { addr, ..._certMintData } = certMintData;
      if (!isAddress(addr)) return alert("Thêm địa chỉ ví");

      setSubmitting(true);
      const url = await uploadIPFS({
        ..._certMintData,
        cert: selectedCertForm,
        date: Math.floor(Date.now() / 1000),
      });
      await addCert(library, account, [addr, selectedCertForm.idx, url]);
      setRefreshCert((pre) => !pre);
      setCertMintData({
        addr: "",
        name: "",
        gender: GENDER.MALE,
        dateOfBirth: "",
        graduateGrade: GRADUATE_GRADE.A,
        mintWhere: "",
      });
      setSubmitting(false);
      onCloseMint();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const [certsMinted, setCertsMinted] = useState([]);

  const [certMintedLoading, setCertMintedLoading] = useState(false);

  const handleOpenCertsMinted = async (idx) => {
    if (!library || isNaN(idx)) return;
    setCertMintedLoading(true);
    onOpenMinted();
    try {
      const certs = await getCertsMinted(library, idx);
      setCertsMinted(certs);
      setCertMintedLoading(false);
    } catch (error) {
      !!certsMinted?.length && setCertsMinted([]);
      setCertMintedLoading(false);
    }
  };

  const renderBody = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>STT</Th>
                <Th>Tên Tiếng Anh</Th>
                <Th>Tên Tiếng Việt</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {specializedTrainings.map((censor, idx) => (
                <Tr key={idx}>
                  <Td>{idx + 1}</Td>
                  <Td>{censor.name}</Td>
                  <Td>{censor.vnName}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteSpecializedTraining(idx)}
                      isLoading={deleting}
                    >
                      Xóa
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        );

      case certMenu.certificates:
        return (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>STT</Th>
                <Th>Chuyên ngành đào tạo</Th>
                <Th>Năm</Th>
                <Th>Số lượng</Th>
                <Th>Đã cấp</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {certs.map((cert, idx) => (
                <Tr key={idx}>
                  <Td>{idx + 1}</Td>
                  <Td>
                    <Box>{cert.specializedTraining?.name}</Box>
                    <Box>{cert.specializedTraining?.vnName}</Box>
                  </Td>
                  <Td>{cert.year}</Td>
                  <Td>{cert.total?.toString()}</Td>
                  <Td>{cert.minted?.toString()}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme="telegram"
                      onClick={() => handleOpenCertsMinted(idx)}
                    >
                      Xem
                    </Button>
                    <Button
                      colorScheme="teal"
                      mx="2"
                      onClick={() => {
                        setSelectedCertForm({ ...cert, idx });
                        onOpenMint();
                      }}
                    >
                      Cấp chứng chỉ
                    </Button>
                    {/* <Button
                      colorScheme="red"
                      isLoading={deleting}
                      onClick={() => handleDeleteCertForm(idx)}
                    >
                      Xóa
                    </Button> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        );

      default:
        return null;
    }
  };

  const renderModalBody = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return (
          <>
            <FormControl isRequired>
              <FormLabel>Tên Tiếng Anh</FormLabel>
              <Input
                value={specializedTrainingName}
                onChange={(e) => setSpecializedTrainingName(e.target.value)}
                name="name"
                placeholder="Tên tiếng anh"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tên Tiếng Việt</FormLabel>
              <Input
                value={specializedTrainingVnName}
                onChange={(e) => setSpecializedTrainingVnName(e.target.value)}
                name="vnName"
                placeholder="Tên tiếng việt"
              />
            </FormControl>
          </>
        );

      case certMenu.certificates:
        return (
          <>
            <FormControl isRequired>
              <FormLabel>Chuyên ngành đào tạo</FormLabel>
              <Select
                value={selectedSpecializedTraining}
                onChange={(e) => {
                  const { value } = e.target;
                  setSelectedSpecializedTraining(value);
                  const specializedTraining = specializedTrainings.find(
                    (s) => s.id.toString() === value
                  );
                  if (specializedTraining) {
                    setCertData((pre) => ({
                      ...pre,
                      specializedTraining: {
                        name: specializedTraining.name,
                        vnName: specializedTraining.vnName,
                      },
                    }));
                  }
                }}
              >
                <option value="" style={{ display: "none" }}>
                  Chọn chuyên ngành
                </option>
                {specializedTrainings.map((v, idx) => (
                  <option key={idx} value={v.id}>
                    {v.name} - {v.vnName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Năm</FormLabel>
              <NumberInput
                min={new Date().getFullYear()}
                value={certData.year}
                onChange={(v) => setCertData((pre) => ({ ...pre, year: +v }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Hình thức đào tạo</FormLabel>
              <Select
                value={certData.modeStudy}
                onChange={(e) =>
                  setCertData((pre) => ({ ...pre, modeStudy: e.target.value }))
                }
              >
                {Object.values(STUDY_MODES).map((v, idx) => (
                  <option key={idx} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Số lượng chứng chỉ có thể cấp</FormLabel>
              <NumberInput
                min={1}
                value={certData.total}
                onChange={(v) => setCertData((pre) => ({ ...pre, total: +v }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Modal isOpen={isOpenMinted} onClose={onCloseMinted} size="7xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chứng chỉ đã cấp</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="11" minH="20em">
              {certMintedLoading ? (
                <Box textAlign="center">
                  <Spinner />
                </Box>
              ) : (
                certsMinted.map((cert, idx) => (
                  <Certificate key={idx} cert={cert} />
                ))
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {certMenu.certificates === selectedItem
              ? "Thêm chứng chỉ"
              : "Thêm chuyên ngành đào tạo"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">{renderModalBody()}</VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              isLoading={submitting}
              onClick={handleSubmit}
            >
              Thêm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal mint cert */}
      <Modal isOpen={isOpenMint} onClose={onCloseMint}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cấp chứng chỉ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCertForm && (
              <VStack spacing="4" align="stretch">
                <Box>
                  Cấp chứng chỉ chuyên ngành{" "}
                  <Box d="inline" fontSize="xl" fontWeight="bold">
                    {selectedCertForm.specializedTraining?.name} -{" "}
                    {selectedCertForm.specializedTraining?.vnName}
                  </Box>{" "}
                  năm{" "}
                  <Box d="inline" fontSize="xl" fontWeight="bold">
                    {selectedCertForm.year}
                  </Box>{" "}
                  cho
                </Box>
                <FormControl isRequired>
                  <FormLabel>Tên Sinh Viên</FormLabel>
                  <Input
                    value={certMintData.name}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        name: e.target.value,
                      }))
                    }
                    name="name"
                    placeholder="Tên Sinh Viên"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Địa chỉ ví</FormLabel>
                  <Input
                    value={certMintData.addr}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        addr: e.target.value,
                      }))
                    }
                    name="address"
                    placeholder="Địa chỉ ví"
                  />
                </FormControl>

                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Giới tính</FormLabel>

                    <Select
                      value={certMintData.gender}
                      onChange={(e) =>
                        setCertMintData((pre) => ({
                          ...pre,
                          gender: e.target.value,
                        }))
                      }
                    >
                      {Object.values(GENDER).map((v, idx) => (
                        <option key={idx} value={v}>
                          {v}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Ngày sinh</FormLabel>
                    <input
                      value={certMintData.dateOfBirth}
                      onChange={(e) =>
                        setCertMintData((pre) => ({
                          ...pre,
                          dateOfBirth: e.target.value,
                        }))
                      }
                      type="date"
                      style={{
                        border: "1px solid",
                        borderColor: "rgba(0,0,0,0.1)",
                        padding: "4px",
                        borderRadius: "5px",
                      }}
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Xếp loại tốt nghiệp</FormLabel>
                  <Select
                    value={certMintData.graduateGrade}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        graduateGrade: e.target.value,
                      }))
                    }
                  >
                    {Object.values(GRADUATE_GRADE).map((v, idx) => (
                      <option key={idx} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nơi cấp chứng chỉ</FormLabel>
                  <Input
                    value={certMintData.mintWhere}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        mintWhere: e.target.value,
                      }))
                    }
                    placeholder="Nơi cấp chứng chỉ"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              isLoading={submitting}
              onClick={handleMintCert}
            >
              Cấp chứng chỉ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HStack>
        <Box>
          <Select
            size="lg"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            {Object.keys(certMenu).map((k, idx) => (
              <option key={idx} value={certMenu[k]} style={{ color: "black" }}>
                {certMenu[k]}
              </option>
            ))}
          </Select>
        </Box>
        <Button colorScheme="teal" onClick={onOpen}>
          Thêm
        </Button>
      </HStack>

      {renderBody()}
    </Box>
  );
};

export default Cert;
