import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { uuid } from 'uuidv4';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import listOfMonths from '../../utils/months';

import { Container, Content, Filters } from './styles';


interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC = () => {

    const { typeListRoute } = useParams();
    const [ data, setData ] = useState<IData[]>([]);
    const [ monthSelected, setMonthSelected ] = useState<string>(String(new Date().getMonth() + 1));
    const [ yearSelected, setYearSelected ] = useState<string>(String(new Date().getFullYear()));

    const title =  typeListRoute === 'entry-balance' ? 'Entradas' : 'Saidas';
    const lineColor = typeListRoute === 'entry-balance' ? '#F7931b' : '#E44C4E';
    const listData = typeListRoute === 'entry-balance' ? gains : expenses;

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month
            }
        })
    },[]);

    const years = useMemo(() => {
        let uniqueYears: number[] = [];

        listData.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            
            if (!uniqueYears.includes(year)) {
                uniqueYears.push(year);
            }
        });

        return uniqueYears.map(year => {
            return {
                value: year,
                label: year
            }
        });
    },[listData]);
    
    useEffect(() => {
         const filteredData = listData.filter( item => {
            const date = new Date(item.date);
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear());

            return month === monthSelected && year === yearSelected;
         });

         const formattedData = filteredData.map(item => {
            return {
                id: uuid(),
                description: item.description,
                frequency: item.frequency,
                amountFormatted: formatCurrency(Number(item.amount)),
                dateFormatted: formatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E',
            }
        }); 

        setData(formattedData);
    }, [listData, monthSelected, yearSelected]);

    return (
        <Container>
            <ContentHeader title={title} lineColor={lineColor}>
                <SelectInput options={months} onChange={(e) => setMonthSelected(e.target.value)} defaultValue={monthSelected}></SelectInput>
                <SelectInput options={years}  onChange={(e) => setYearSelected(e.target.value)} defaultValue={yearSelected}></SelectInput>
            </ContentHeader>

            <Filters>
                <button type="button" 
                className="tag-filter  tag-filter-recurrent">Recorrentes</button>

                <button type="button" 
                className="tag-filter tag-filter-eventual">Eventuais</button>
            </Filters>

            <Content>
                {
                    data.map( item => (
                        <HistoryFinanceCard
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}></HistoryFinanceCard>
                    ))
                }
                
            </Content>

        </Container>
    );
}

export default List;