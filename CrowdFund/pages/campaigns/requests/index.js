import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { Button, Card } from "semantic-ui-react";
import { useRouter } from "next/router";
import getCampaign from "../../../Ethereum/campaign";
import web3 from "../../../Ethereum/web3";
import { Link, Router } from "../../../routes";

export default function Request() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const address = router.query.address; // Extract the address from router query
    const loadRequests = async () => {
      try {
        console.log(router.query.address);
        const campaign = getCampaign(address);

        const requestsCount = await campaign.methods.getRequestsCount().call();
        const requests = [];

        for (let i = 0; i < requestsCount; i++) {
          const request = await campaign.methods.requests(i).call();
          requests.push(request);
        }

        setRequests(requests);
        console.log(requests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    loadRequests();
  }, [router]);

  const onApprove = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const address = router.query.address;
      if (!address) {
        setError("Address not available in query parameters");
        setLoading(false);
        return;
      }
      const campaign = getCampaign(address);
      await campaign.methods.approveRequest(index).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const onFinalize = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const address = router.query.address;
      if (!address) {
        setError("Address not available in query parameters");
        setLoading(false);
        return;
      }
      console.log(address)
      const campaign = getCampaign(address);
      console.log(campaign)
      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error finalizing request:", error);
    }
    console.log(index)
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Pending Requests</h3>
        {/* Use the address variable */}
        <Link route={`/campaigns/${router.query.address}/requests/new`}>
          <a className="item">
            <Button
              content="Add Requests"
              primary
              style={{ marginBottom: "15px" }}
            />
          </a>
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div>No requests</div>
      ) : (
        <Card.Group>
          {requests.map((request, index) => (
            <Card style={{ width: "400px" }} key={index}>
              <Card.Content>
                <Card.Header>{request.description}</Card.Header>
                <Card.Meta>
                  Value: {web3.utils.fromWei(request.value, "ether")}
                </Card.Meta>
                <Card.Description>
                  Recipient: {request.recipient}
                </Card.Description>
                <Card.Description>
                  Approval Count: {String(request.approvalcount)}
                </Card.Description>

                <Card.Description>
                  Complete: {request.complete ? "Yes" : "No"}
                </Card.Description>
                <Button
                  type="submit"
                  primary
                  basic
                  loading={loading}
                  disabled={loading}
                  style={{ margin: "7px" }}
                  onClick={() => onApprove(index)}
                >
                  Approve
                </Button>
                <Button
                  type="submit"
                  positive
                  basic
                  loading={loading}
                  disabled={loading}
                  style={{ margin: "7px" }}
                  onClick={() => onFinalize(index)}
                >
                  Finalize
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
    </Layout>
  );
}
