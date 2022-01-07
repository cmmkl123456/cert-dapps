import { Button } from "@chakra-ui/button";
import { Box, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import Certificate from "components/Certificate";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { getOwnerCerts, getRefactorName } from "utils/getCertContract";

const Users = () => {
  const { address } = useParams();
  const { library } = useActiveWeb3React();
  const history = useHistory();

  const [certs, setCerts] = useState([]);
  const [refactorName, setRefactorName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!library || !address) return;
      try {
        const ownerCerts = await getOwnerCerts(library, address);
        const refactorName = await getRefactorName(library);
        setCerts(ownerCerts);
        setRefactorName(refactorName);
        setLoading(false);
        if (ownerCerts?.length === 0) {
          alert("Bạn không có bất kỳ chứng chỉ nào");
          history.push("/");
        }
      } catch (error) {
        !!certs?.length && setCerts([]);
        setLoading(false);
        console.error(error);
      }
    })();
  }, [library, address]);

  return loading ? (
    <Box textAlign="center">
      <Spinner />
    </Box>
  ) : address ? (
    <VStack align="stretch" spacing="20">
      {certs.map((cert, idx) => (
        <Certificate cert={cert} key={idx} refactorName={refactorName} />
      ))}
    </VStack>
  ) : null;
};

export default Users;
