import { Button } from "@chakra-ui/button";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { GENDER } from "configs";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import { changeFormatDate } from "utils";
import {
  approveCert,
  getCertsPending,
  rejectCert,
} from "utils/getCertContract";

const certTypes = {
  pending: "Chờ phê duyệt",
  reviewed: "reviewed",
};

const Censors = () => {
  const { account, library } = useActiveWeb3React();

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [selectedCertType, setSelectedCertType] = useState(certTypes.pending);
  const [certsPending, setCertsPending] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (library) {
        try {
          const certs = await getCertsPending(library);
          setCertsPending(certs);
          setLoading(false);
        } catch (error) {
          !!certsPending?.length && setCertsPending([]);
          setLoading(false);
          console.error(error);
        }
      }
    })();
  }, [library, refresh]);

  const handleAcceptCert = async (certIdx) => {
    if (!library || !account || submitting) return;

    try {
      setSubmitting(true);
      await approveCert(library, account, [certIdx]);
      setRefresh((pre) => !pre);
      setSubmitting(false);
      alert("Phê duyệt thành công");
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      if (error.data?.message) {
        alert(
          error.data.message?.toString().replace("execution reverted: ", "") ??
            "ERROR"
        );
      }
    }
  };

  const [rejecting, setRejecting] = useState(false);

  const handleRejectCert = async (certIdx) => {
    if (!library || !account || submitting) return;

    try {
      setRejecting(true);
      await rejectCert(library, account, [certIdx]);
      setRefresh((pre) => !pre);
      setRejecting(false);
      alert("Từ chối thành công");
    } catch (error) {
      setRejecting(false);
      console.error(error);
      if (error.data?.message) {
        alert(
          error.data.message?.toString().replace("execution reverted: ", "") ??
            "ERROR"
        );
      }
    }
  };

  return (
    <Box>
      <HStack>
        <Box>Chứng chỉ: </Box>
        <Box>
          <Select
            value={selectedCertType}
            onChange={(e) => setSelectedCertType(e.target.value)}
          >
            {Object.keys(certTypes).map((k, idx) => (
              <option
                key={idx}
                value={certTypes[k]}
                style={{
                  color: "black",
                }}
              >
                {certTypes[k]}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>

      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Địa chỉ ví sinh viên</Th>
            <Th>Thông tin sinh viên</Th>
            <Th>Thông tin chứng chỉ</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan="5">
                <Spinner />
              </Td>
            </Tr>
          ) : (
            certsPending.map((censor, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>{censor.to}</Td>
                <Td>
                  <Box>Tên sinh viên: {censor.name}</Box>
                  <Box>Giới tính: {censor.gender}</Box>
                  <Box>Ngày sinh: {changeFormatDate(censor.dateOfBirth)}</Box>
                  <Box>Xếp loại tốt nghiệp: {censor.graduateGrade}</Box>
                  <Box>Nơi cấp: {censor.mintWhere}</Box>
                </Td>
                <Td>
                  <Box>Chuyên ngành đào tạo:</Box>
                  <Box>
                    {censor.cert?.specializedTraining?.name} -{" "}
                    {censor.cert?.specializedTraining?.vnName}
                  </Box>
                  <Box>Năm: {censor.cert?.year}</Box>
                  <Box>Hình thức đào tạo: {censor.cert?.modeStudy}</Box>
                </Td>
                <Td isNumeric>
                  <VStack>
                    <Button
                      colorScheme="teal"
                      mr="2"
                      onClick={() => handleAcceptCert(idx)}
                      isLoading={submitting}
                    >
                      Chấp thuận
                    </Button>
                    <Button
                      colorScheme="red"
                      isLoading={rejecting}
                      onClick={() => handleRejectCert(idx)}
                    >
                      Từ chối
                    </Button>
                  </VStack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Censors;
