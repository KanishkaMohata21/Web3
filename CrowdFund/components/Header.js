import React from "react";
import { Menu, Button } from "semantic-ui-react";
import {Link} from '../routes'

export default function Navbar() {
    return (
        <Menu style={{ margin: '20px' }}>
            <Link route='/'>
                <a className="item">
                    <h3>CrowdFund</h3>
                </a>
            </Link>
            <Menu.Menu position='right'>
            <Link route='/campaigns/new'>
                <a className="item">
                <Button content="Create Campaign" icon="add circle" primary />
                </a>
            </Link>
            </Menu.Menu>
        </Menu>
    );
}
