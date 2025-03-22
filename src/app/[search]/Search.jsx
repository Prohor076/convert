'use client';

import './style.css';
import {useEffect, useState} from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const fetchData = async (value) => {
    const data = await fetch(`/api/convert/${value}`);
    return data.json();
};

export default function Search({ search }) {
    const [searchValue, setSearchValue] = useState(search);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    const extractSteamInfo = (url) => {
        // Проверяем наличие username в URL (формат /id/username)
        const usernameRegex = /\/id\/([^\/]+)/;
        let match = url.match(usernameRegex);
        if (match) return match[1];

        // Проверяем наличие SteamID в URL (17-значное число в формате /profiles/123...)
        const steamIDRegex = /\/profiles\/(\d{17})/;
        match = url.match(steamIDRegex);
        if (match) return match[1];

        return url;
    };

    const searchFunc = async () => {
        if (searchValue == null) return sendNotify('Поле не может быть пустым!', 'error');
        setLoading(true);
        const value = extractSteamInfo(searchValue);
        const data = await fetchData(value);
        if (data.status == 'success') {
            setResult(data.data);
        } else {
            setError(true);
        }
        setLoading(false);
    }

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await searchFunc();
        }
    };

    const sendNotify = (text, status = 'success') => {
        if (status == 'success') {
            toast.success(text, {
                duration: 2500,
                position: "top-right",
                iconTheme: {
                    primary: '#3A9A5A',
                },
                style: {
                    backgroundColor: "#3A9A5A",
                    color: "#fff",
                }
            })
        } else {
            toast.error(text, {
                duration: 2500,
                position: "top-right",
                iconTheme: {
                    primary: '#9A3A3A',
                },
                style: {
                    backgroundColor: "#9A3A3A",
                    color: "#fff",
                }
            })
        }
    };

    const copyText = async (target, link = false) => {
        const textToCopy = link ? target.closest('.main__items-body-items-item-value').querySelector('a').href : target.closest('.main__items-body-items-item-value').textContent;
        sendNotify('Успешно скопировано!');
        console.log(textToCopy);
        await navigator.clipboard.writeText(textToCopy);
    }

    // if (searchValue && loading == true) {
    //     searchFunc();
    //     setLoading(false);
    // }

    return (
        <div className={`main`}>
            <div className="main__items">
                <div className="main__items-field">
                    <div className="main__items-field-input">
                        <input
                            type="text"
                            placeholder="Введите профиль или SteamID"
                            value={searchValue != null ? searchValue : ''}
                            onChange={(e) => {
                                let value = e.target.value;
                                setSearchValue(value);
                                setResult(null);
                                setError(false);
                            }}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className="main__items-field-button" onClick={(e) => result == null && searchFunc()}>
                        {loading ? 'Ищем...' : 'Найти!'}
                    </div>
                </div>
                <div className={`main__items-body ${loading || error ? 'active' : ''}`}>
                    <div className="main__items-body-items">
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">{loading ? 'Загрузка...' : 'Произошла ошибка'}</div>
                        </div>
                    </div>
                </div>
                <div className={`main__items-body ${result != null ? 'active' : ''}`}>
                    <div className="main__items-body-items">
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">SteamID32:</div>
                            <div className="main__items-body-items-item-value">
                                {result && result.steamid32}
                                <svg onClick={(e) => copyText(e.target)} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"><g><path d="M256,448c-82.436-0.094-149.239-66.898-149.333-149.333v-192c0-4.267,0.277-8.533,0.64-12.629   C68.139,110.864,42.731,149.371,42.667,192v213.333C42.737,464.214,90.452,511.93,149.333,512h128   c42.629-0.064,81.136-25.473,97.963-64.64c-4.267,0.363-8.363,0.64-12.629,0.64H256z"></path><path d="M451.307,69.803l-48.725-50.325C397.217,14.045,390.924,9.616,384,6.4v78.933h78.08   C459.281,79.65,455.65,74.415,451.307,69.803z"></path><path d="M362.667,85.333c0,11.782,9.551,21.333,21.333,21.333h84.608c-1.571-13.852-7.65-26.805-17.301-36.864l-48.725-50.325   c-10.659-10.804-24.8-17.485-39.915-18.859V85.333z"></path><path d="M320,85.333V0h-64c-58.881,0.071-106.596,47.786-106.667,106.667v192c0.071,58.881,47.786,106.596,106.667,106.667h106.667   c58.881-0.071,106.596-47.786,106.667-106.667V149.333H384C348.654,149.333,320,120.68,320,85.333z"></path></g></svg>
                            </div>
                        </div>
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">SteamID64:</div>
                            <div className="main__items-body-items-item-value">
                                {result && result.steamid64}
                                <svg onClick={(e) => copyText(e.target)} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"><g><path d="M256,448c-82.436-0.094-149.239-66.898-149.333-149.333v-192c0-4.267,0.277-8.533,0.64-12.629   C68.139,110.864,42.731,149.371,42.667,192v213.333C42.737,464.214,90.452,511.93,149.333,512h128   c42.629-0.064,81.136-25.473,97.963-64.64c-4.267,0.363-8.363,0.64-12.629,0.64H256z"></path><path d="M451.307,69.803l-48.725-50.325C397.217,14.045,390.924,9.616,384,6.4v78.933h78.08   C459.281,79.65,455.65,74.415,451.307,69.803z"></path><path d="M362.667,85.333c0,11.782,9.551,21.333,21.333,21.333h84.608c-1.571-13.852-7.65-26.805-17.301-36.864l-48.725-50.325   c-10.659-10.804-24.8-17.485-39.915-18.859V85.333z"></path><path d="M320,85.333V0h-64c-58.881,0.071-106.596,47.786-106.667,106.667v192c0.071,58.881,47.786,106.596,106.667,106.667h106.667   c58.881-0.071,106.596-47.786,106.667-106.667V149.333H384C348.654,149.333,320,120.68,320,85.333z"></path></g></svg>
                            </div>
                        </div>
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">AccountID:</div>
                            <div className="main__items-body-items-item-value">
                                {result && result.accountid}
                                <svg onClick={(e) => copyText(e.target)} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"><g><path d="M256,448c-82.436-0.094-149.239-66.898-149.333-149.333v-192c0-4.267,0.277-8.533,0.64-12.629   C68.139,110.864,42.731,149.371,42.667,192v213.333C42.737,464.214,90.452,511.93,149.333,512h128   c42.629-0.064,81.136-25.473,97.963-64.64c-4.267,0.363-8.363,0.64-12.629,0.64H256z"></path><path d="M451.307,69.803l-48.725-50.325C397.217,14.045,390.924,9.616,384,6.4v78.933h78.08   C459.281,79.65,455.65,74.415,451.307,69.803z"></path><path d="M362.667,85.333c0,11.782,9.551,21.333,21.333,21.333h84.608c-1.571-13.852-7.65-26.805-17.301-36.864l-48.725-50.325   c-10.659-10.804-24.8-17.485-39.915-18.859V85.333z"></path><path d="M320,85.333V0h-64c-58.881,0.071-106.596,47.786-106.667,106.667v192c0.071,58.881,47.786,106.596,106.667,106.667h106.667   c58.881-0.071,106.596-47.786,106.667-106.667V149.333H384C348.654,149.333,320,120.68,320,85.333z"></path></g></svg>
                            </div>
                        </div>
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">Steam-профиль:</div>
                            <div className="main__items-body-items-item-value">
                                {result && <Link href={`https://steamcommunity.com/profiles/${result.steamid64}`} target={`_blank`}>*тык*</Link>}
                                <svg onClick={(e) => copyText(e.target, true)} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"><g><path d="M256,448c-82.436-0.094-149.239-66.898-149.333-149.333v-192c0-4.267,0.277-8.533,0.64-12.629   C68.139,110.864,42.731,149.371,42.667,192v213.333C42.737,464.214,90.452,511.93,149.333,512h128   c42.629-0.064,81.136-25.473,97.963-64.64c-4.267,0.363-8.363,0.64-12.629,0.64H256z"></path><path d="M451.307,69.803l-48.725-50.325C397.217,14.045,390.924,9.616,384,6.4v78.933h78.08   C459.281,79.65,455.65,74.415,451.307,69.803z"></path><path d="M362.667,85.333c0,11.782,9.551,21.333,21.333,21.333h84.608c-1.571-13.852-7.65-26.805-17.301-36.864l-48.725-50.325   c-10.659-10.804-24.8-17.485-39.915-18.859V85.333z"></path><path d="M320,85.333V0h-64c-58.881,0.071-106.596,47.786-106.667,106.667v192c0.071,58.881,47.786,106.596,106.667,106.667h106.667   c58.881-0.071,106.596-47.786,106.667-106.667V149.333H384C348.654,149.333,320,120.68,320,85.333z"></path></g></svg>
                            </div>
                        </div>
                        <div className="main__items-body-items-item">
                            <div className="main__items-body-items-item-text">Профиль на сайте:</div>
                            <div className="main__items-body-items-item-value">
                                {result && <Link href={`https://rus-standart.xyz/profiles/${result.steamid64}/0/?search=1`} target={`_blank`}>*тык*</Link>}
                                <svg onClick={(e) => copyText(e.target, true)} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"><g><path d="M256,448c-82.436-0.094-149.239-66.898-149.333-149.333v-192c0-4.267,0.277-8.533,0.64-12.629   C68.139,110.864,42.731,149.371,42.667,192v213.333C42.737,464.214,90.452,511.93,149.333,512h128   c42.629-0.064,81.136-25.473,97.963-64.64c-4.267,0.363-8.363,0.64-12.629,0.64H256z"></path><path d="M451.307,69.803l-48.725-50.325C397.217,14.045,390.924,9.616,384,6.4v78.933h78.08   C459.281,79.65,455.65,74.415,451.307,69.803z"></path><path d="M362.667,85.333c0,11.782,9.551,21.333,21.333,21.333h84.608c-1.571-13.852-7.65-26.805-17.301-36.864l-48.725-50.325   c-10.659-10.804-24.8-17.485-39.915-18.859V85.333z"></path><path d="M320,85.333V0h-64c-58.881,0.071-106.596,47.786-106.667,106.667v192c0.071,58.881,47.786,106.596,106.667,106.667h106.667   c58.881-0.071,106.596-47.786,106.667-106.667V149.333H384C348.654,149.333,320,120.68,320,85.333z"></path></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}