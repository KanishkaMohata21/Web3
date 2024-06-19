import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/layout";
import getCampaign from "../../Ethereum/campaign";
import web3 from "../../Ethereum/web3";
import Contribution from "../../components/contributeForm";
import { Link } from "../../routes";

export default function Show() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    minimumContribution: "",
    balance: "",
    requestsCount: "",
    approverCount: "",
    manager: "",
    name: "",
    description: "",
    outcome: "",
    estimatedTime: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = router.query.address;
        if (!address) {
          console.log("Address not available in query parameters");
          Router.pushRoute('/');
          return;
        }

        console.log("Address from URL:", address);

        const campaign = getCampaign(address);
        console.log("Campaign instance:", campaign);

        const summaryData = await campaign.methods.getSummary().call();
        console.log("Summary data:", summaryData);

        // Fetch additional details
        const name = await campaign.methods.projectName().call();
        const description = await campaign.methods.projectDescription().call();
        const outcome = await campaign.methods.projectOutcome().call();
        const estimatedTime = summaryData[7].toString(); // Ensure to convert to string

        // Update state with correct property accesses
        setSummary({
          minimumContribution: summaryData[0].toString(),
          balance: web3.utils.fromWei(summaryData[1], "ether"), // Convert balance from wei to ether
          requestsCount: summaryData[2].toString(),
          approverCount: summaryData[3].toString(),
          manager: summaryData[8],
          name: name,
          description: description,
          outcome: outcome,
          estimatedTime: estimatedTime,
        });

        console.log("Updated summary state:", summary);
      } catch (error) {
        console.error("Error fetching campaign summary:", error);
      }
    };

    fetchData();
  }, [router.query]);

  return (
    <Layout>
      <div>
        <h1>Campaign Details</h1>
        <Grid>
          <Grid.Column width={11}>
            <Card.Group>
              <Card>
                <Card.Content>
                  <Card.Header>Name</Card.Header>
                  <Card.Description>
                    The name of the project associated with this campaign.
                    <br />
                    <strong>{summary.name || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>Estimated Time</Card.Header>
                  <Card.Description>
                    The estimated time to complete the project.
                    <br />
                    <strong>{summary.estimatedTime || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card style={{ width: "590px" }}>
                <Card.Content>
                  <Card.Header>Description</Card.Header>
                  <Card.Description>
                    The description of the project associated with this campaign.
                    <br />
                    <strong>{summary.description || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card style={{ width: "590px" }}>
                <Card.Content>
                  <Card.Header>Outcome</Card.Header>
                  <Card.Description>
                    The expected outcome of the project.
                    <br />
                    <strong>{summary.outcome || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>Minimum Contribution</Card.Header>
                  <Card.Description>
                    The minimum amount of wei required to become an approver of
                    this campaign.
                    <br />
                    <strong>
                      {summary.minimumContribution || "Loading..."} wei
                    </strong>
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>Balance</Card.Header>
                  <Card.Description>
                    The current balance of the campaign in ether. This is the
                    amount of funds available to the campaign.
                    <br />
                    <strong>{summary.balance || "Loading..."} ETH</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>Requests Count</Card.Header>
                  <Card.Description>
                    The number of spending requests created by the campaign
                    manager. These requests must be approved by the approvers.
                    <br />
                    <strong>{summary.requestsCount || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>Approver Count</Card.Header>
                  <Card.Description>
                    The number of people who have already donated to this
                    campaign and are considered approvers.
                    <br />
                    <strong>{summary.approverCount || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card style={{ width: "590px" }}>
                <Card.Content>
                  <Card.Header>Manager</Card.Header>
                  <Card.Description>
                    The Ethereum address of the person who created this campaign
                    and can create spending requests.
                    <br />
                    <strong>{summary.manager || "Loading..."}</strong>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={5}>
            <Contribution />
            <Link route={`/campaigns/${router.query.address}/requests`}>
              <a className="item">
                <Button
                  content="View Requests"
                  primary
                  style={{ marginTop: "30px" }}
                />
              </a>
            </Link>
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
}
