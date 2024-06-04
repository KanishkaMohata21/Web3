import React, { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import instance from "../Ethereum/factory";
import Layout from "../components/layout";
import {Link} from '../routes'

const App = () => {
  const [campaigns, setCampaigns] = useState([]);

  const items = campaigns.map((address) => ({
    header: address,
    description:(<Link route={`/campaigns/${address}`}>
     <a>View Campaign</a>
    </Link> ),
    fluid: true,
  }));

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const deployedCampaigns = await instance.methods
          .getDeployedCampaigns()
          .call();
        setCampaigns(deployedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Card.Group items={items} />
      </div>
    </Layout>
  );
};

export default App;
