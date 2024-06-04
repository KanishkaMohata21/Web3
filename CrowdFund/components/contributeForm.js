import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import getCampaign from '../Ethereum/campaign';
import web3 from '../Ethereum/web3';
import {Link,Router} from '../routes'

const Contribution = () => {
    const [contribution, setContribution] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        setContribution(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { address } = router.query;
        if (!address) return;
        console.log("Address from URL:", address);
        const campaign = getCampaign(address);
        console.log("Campaign instance:", campaign);

        setLoading(true);
        setError('');

        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, 'ether')
            });
            Router.pushRoute('/');
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div>
            <h3>Contribute to the campaign</h3>
            <Form onSubmit={handleSubmit} error={!!error}>
                <Form.Field>
                    <label>Contribution</label>
                    <Input
                        label='eth'
                        labelPosition='right'
                        value={contribution}
                        onChange={handleInputChange}
                        style={{ width: '250px' }}
                    />
                </Form.Field>
                <Button type='submit' primary loading={loading} disabled={loading}>
                    Send
                </Button>
            </Form>
            {error && <Message error header='Oops! Something went wrong' content={error} style={{ width: '300px' }} />}
        </div>
    );
};

export default Contribution;
