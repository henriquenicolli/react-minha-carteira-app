import React, { useState, useEffect, useMemo } from 'react';
import CountUp from 'react-countup';

import dollarImg from '../../assets/dollar.svg';
import arrowUpImg from '../../assets/arrow-up.svg';
import arrowDownImg from '../../assets/arrow-down.svg';

import {
    Container,
} from './styles';

interface IWalletBoxProps {
    title: string;
    amount: number;
    footerLabel: string;
    icon: 'dolar' | 'arrowUp' | 'arrowDown';
    color: string;
}

const WalletBox: React.FC<IWalletBoxProps> = ({
    title,
    amount,
    footerLabel,
    icon,
    color
}) => {

    const iconSelected = useMemo(() => {
        if (icon === 'dolar')
            return dollarImg;

        if (icon === 'arrowUp')
            return arrowUpImg;

        if (icon === 'arrowDown')
            return arrowDownImg;
    },[icon]);

    return (
        <Container color={color}>
            <span>{title}</span>
            <h1>
                <CountUp end={amount}
                prefix={"R$ "}
                separator="."
                decimal=","
                decimals={2}
                preserveValue></CountUp>
            </h1>
            <small>{footerLabel}</small>
            <img src={iconSelected} alt={title}></img>
        </Container>
    );
}

export default WalletBox;