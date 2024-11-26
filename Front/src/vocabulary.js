import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './Modal';
import './vocabulary.css';

const Vocabulary = ({ vocabularies, onUpdateVocabulary }) => {
    const { id } = useParams();
    const [vocabulary, setVocabulary] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wordInput, setWordInput] = useState('');
    const [meanings, setMeanings] = useState([{ meaning: '', partOfSpeech: '' }]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editWordInput, setEditWordInput] = useState('');
    const [editMeanings, setEditMeanings] = useState([{ meaning: '', partOfSpeech: '' }]);
    const [editIndex, setEditIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [vocabularyTitle, setVocabularyTitle] = useState('');

    useEffect(() => {
        const currentVocab = vocabularies?.find(vocab => vocab.id === Number(id));
        if (currentVocab) {
            setVocabulary(currentVocab.words || []);
            setVocabularyTitle(currentVocab.title);
        }
    }, [vocabularies, id]);

    const toggleSelection = (index) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedItems(newSelected);
    };

    const navigate = useNavigate();
    const openAddModal = () => setIsModalOpen(true);
    const closeAddModal = () => {
        setIsModalOpen(false);
        setWordInput('');
        setMeanings([{ meaning: '', partOfSpeech: '' }]);
    };

    const openEditModal = (index) => {
        const wordToEdit = vocabulary[index];
        setEditWordInput(wordToEdit.word);
        setEditMeanings(
            wordToEdit.meanings.split(', ').map((m) => {
                const [meaning, partOfSpeech] = m.split(' (');
                return { meaning, partOfSpeech: partOfSpeech.slice(0, -1) };
            })
        );
        setEditIndex(index);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditWordInput('');
        setEditMeanings([{ meaning: '', partOfSpeech: '' }]);
        setEditIndex(null);
    };

    const addMeaning = () => setMeanings([...meanings, { meaning: '', partOfSpeech: '' }]);
    const addEditMeaning = () => setEditMeanings([...editMeanings, { meaning: '', partOfSpeech: '' }]);

    const removeMeaning = (index) => {
        if (meanings.length > 1) {
            setMeanings(meanings.filter((_, i) => i !== index));
        }
    };

    const removeEditMeaning = (index) => {
        if (editMeanings.length > 1) {
            setEditMeanings(editMeanings.filter((_, i) => i !== index));
        }
    };

    const handleMeaningChange = (index, field, value) => {
        const updatedMeanings = meanings.map((meaning, i) =>
            i === index ? { ...meaning, [field]: value } : meaning
        );
        setMeanings(updatedMeanings);
    };

    const handleEditMeaningChange = (index, field, value) => {
        const updatedMeanings = editMeanings.map((meaning, i) =>
            i === index ? { ...meaning, [field]: value } : meaning
        );
        setEditMeanings(updatedMeanings);
    };

    const submitWord = () => {
        if (wordInput && meanings.every((m) => m.meaning && m.partOfSpeech)) {
            const newWord = {
                id: Date.now(),
                word: wordInput,
                meanings: meanings.map((m) => `${m.meaning} (${m.partOfSpeech})`).join(', ')
            };
            
            const updatedVocabulary = [...vocabulary, newWord];
            setVocabulary(updatedVocabulary);
            onUpdateVocabulary(Number(id), updatedVocabulary);
            closeAddModal();
        } else {
            alert('모든 필드를 입력해주세요.');
        }
    };

    const submitEditWord = () => {
        if (editWordInput && editMeanings.every((m) => m.meaning && m.partOfSpeech)) {
            const updatedVocabulary = [...vocabulary];
            updatedVocabulary[editIndex] = {
                ...updatedVocabulary[editIndex],
                word: editWordInput,
                meanings: editMeanings.map((m) => `${m.meaning} (${m.partOfSpeech})`).join(', '),
            };
            setVocabulary(updatedVocabulary);
            onUpdateVocabulary(Number(id), updatedVocabulary);
            closeEditModal();
        } else {
            alert('모든 필드를 입력해주세요.');
        }
    };

    const deleteVocabulary = (index) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            const updatedVocabulary = vocabulary.filter((_, i) => i !== index);
            setVocabulary(updatedVocabulary);
            onUpdateVocabulary(Number(id), updatedVocabulary);
        }
    };

    const goBack = () => window.history.back();

    return (
        <div style={styles.vocabularyContainer}>
            <header style={styles.header}>
                <div style={styles.backButton} onClick={goBack}>
                    ←
                </div>
                <h1>{vocabularyTitle}</h1>
                <div style={styles.vocabButtons}>
                    <button className="custom-button" onClick={() => navigate(`/flashcard/${id}`)}>플래시 카드</button>
                    <button className="custom-button" onClick={() => navigate(`/OXquiz/${id}`)}>O/X</button>
                    <button className="custom-button" onClick={() => navigate(`/fillin/${id}`)}>빈칸 채우기</button>
                    <button className="custom-button" onClick={openAddModal}>+</button>
                </div>
            </header>

            <main>
                <div style={styles.vocaList}>
                    {vocabulary.map((item, index) => (
                        <div 
                            key={item.id || index} 
                            style={styles.vocaItem}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => toggleSelection(index)}
                        >
                            <div style={styles.vocaItemContent}>
                                <div style={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkboxInput}
                                        checked={selectedItems.has(index)}
                                        onChange={(e) => {
                                            e.stopPropagation(); // 이벤트 버블링 방지
                                            toggleSelection(index);
                                        }}
                                    />
                                </div>
                                <div style={styles.wordContent}>
                                    <div>{item.word}</div>
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                                        {item.meanings}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                ...styles.actionButtons,
                                opacity: hoveredIndex === index ? 1 : 0,
                                transition: 'opacity 0.3s ease'
                            }}>
                                <button
                                    className="action-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(index);
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    className="action-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteVocabulary(index);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {isModalOpen && (
                <Modal title="단어 추가" onClose={closeAddModal}>
                    <input
                        style={{...styles.commonInput, ...styles.input}}
                        type="text"
                        placeholder="단어 입력"
                        value={wordInput}
                        onChange={(e) => setWordInput(e.target.value)}
                    />
                    <div style={styles.meaningsContainer}>
                        {meanings.map((meaning, index) => (
                            <div key={index} style={styles.meaningItem}>
                                <input
                                    style={{...styles.commonInput, ...styles.input}}
                                    type="text"
                                    placeholder="뜻 입력"
                                    value={meaning.meaning}
                                    onChange={(e) => handleMeaningChange(index, 'meaning', e.target.value)}
                                />
                                <select
                                    style={{...styles.commonInput, ...styles.selectBox}}
                                    value={meaning.partOfSpeech}
                                    onChange={(e) => handleMeaningChange(index, 'partOfSpeech', e.target.value)}
                                >
                                    <option value="">품사 선택</option>
                                    <option value="명사">명사</option>
                                    <option value="형용사">형용사</option>
                                    <option value="동사">동사</option>
                                    <option value="부사">부사</option>
                                </select>
                                {meanings.length > 1 && (
                                    <button 
                                        className="custom-button"
                                        onClick={() => removeMeaning(index)}
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="custom-button" onClick={addMeaning}>+</button>
                    <button className="custom-button" onClick={submitWord}>추가</button>
                </Modal>
            )}

            {isEditModalOpen && (
                <Modal title="단어 수정" onClose={closeEditModal}>
                    <input
                        style={{...styles.commonInput, ...styles.input}}
                        type="text"
                        placeholder="단어 입력"
                        value={editWordInput}
                        onChange={(e) => setEditWordInput(e.target.value)}
                    />
                    <div style={styles.meaningsContainer}>
                        {editMeanings.map((meaning, index) => (
                            <div key={index} style={styles.meaningItem}>
                                <input
                                    style={{...styles.commonInput, ...styles.input}}
                                    type="text"
                                    placeholder="뜻 입력"
                                    value={meaning.meaning}
                                    onChange={(e) => handleEditMeaningChange(index, 'meaning', e.target.value)}
                                />
                                <select
                                    style={{...styles.commonInput, ...styles.selectBox}}
                                    value={meaning.partOfSpeech}
                                    onChange={(e) => handleEditMeaningChange(index, 'partOfSpeech', e.target.value)}
                                >
                                    <option value="">품사 선택</option>
                                    <option value="명사">명사</option>
                                    <option value="형용사">형용사</option>
                                    <option value="동사">동사</option>
                                    <option value="부사">부사</option>
                                </select>
                                {editMeanings.length > 1 && (
                                    <button 
                                        className="custom-button"
                                        onClick={() => removeEditMeaning(index)}
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="custom-button" style={styles.addMeaningButton} onClick={addEditMeaning}>+</button>
                    <button className="custom-button" onClick={submitEditWord}>수정</button>
                </Modal>
            )}
        </div>
    );
};

const styles = {
    vocabularyContainer: {
        fontFamily: 'TTHakgyoansimEunhasuR',
        padding: '20px'
    },
    header: {
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    vocabButtons: {
        display: 'flex',
        gap: '10px'
    },
    backButton: {
        fontSize: '24px',
        cursor: 'pointer',
        padding: '10px'
    },
    vocaList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    vocaItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '18px',
        padding: '15px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    },
    vocaItemContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        flex: 1,
    },
    wordContent: {
        cursor: 'pointer',
        flex: 1,
    },
    checkbox: {
        marginRight: '10px',
    },
    checkboxInput: {
        accentColor: '#c5d8ff',
    },
    actionButtons: {
        display: 'flex',
        gap: '10px',
        opacity: 0,
        transition: 'opacity 0.3s ease'
    },
    commonInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px'
    },
    input: {
        width: '80%',
        marginBottom: '10px'
    },
    meaningsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    meaningItem: {
        display: 'flex',
        gap: '10px'
    },
    selectBox: {
        fontFamily: 'TTHakgyoansimEunhasuR',
        width: '120px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none'
    },
    addMeaningButton: {
        width: '40px',
        height: '40px',
        padding: '0',
        borderRadius: '50%',
        marginRight: '10px'
    },
    selectedVocaItem: {
        borderLeft: '4px solid #a9c6f8',
    },
};

export default Vocabulary;