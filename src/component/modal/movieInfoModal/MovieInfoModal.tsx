import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { height } from '../../../utils/Constant';
import imageIndex from '../../../assets/imageIndex';
import { Color } from '../../../theme/color';
import font from '../../../theme/font';

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    synopsis: string;
    releaseDate: string;
    genre: string;
    type?: string;
    groupMembers?:[];
}

const MovieInfoModal: React.FC<Props> = ({
    visible,
    onClose,
    title,
    synopsis,
    releaseDate,
    genre,
    type,
    groupMembers
}) => {
    const [expanded, setExpanded] = useState(false);
    const shortText = synopsis.slice(0, 150);
    const insets = useSafeAreaInsets();
    
    // Calculate responsive height
    const { height: screenHeight } = Dimensions.get('window');
    const isSmallDevice = screenHeight < 700;
    const maxModalHeight = isSmallDevice 
        ? screenHeight * 0.75  // 75% on small devices
        : screenHeight * 0.66; // 66% on normal/large devices
    
    // Dynamic padding based on safe area
    const bottomPadding = Math.max(insets.bottom, 20) + 20;

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[
                            styles.modalContent, 
                            { 
                                backgroundColor: type === "watchModal" ? Color.modalTransperant : Color.modalBg,
                                maxHeight: maxModalHeight,
                                paddingBottom: bottomPadding,
                            }
                        ]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={{ height: 24, width: 24 }}></View>
                                <Text style={styles.headerText}>Info</Text>
                                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Image
                                        source={imageIndex.closeimg}
                                        style={{ height: 24, width: 24 }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                contentContainerStyle={styles.scrollContent}
                            >


                                {/* Title */}
                                <Text style={styles.title}>{title}</Text>

                                {/* Synopsis */}
                                <Text style={styles.sectionTitle}>Synopsis</Text>
                                <Text style={styles.text}>
                                    {synopsis}
                                    {/* {expanded ? synopsis : `${shortText}... `}
                                    {synopsis.length > 120 && (
                                        <Text onPress={() => setExpanded(!expanded)} style={styles.readMore}>
                                            {expanded ? 'Read less' : 'Read more..'}
                                        </Text>
                                    )} */}
                                </Text>

                                {/* Release Date */}
                                <Text style={styles.sectionTitle}>Release date</Text>
                                <Text style={styles.text}>{releaseDate}</Text>

                                {/* Genre */}
                                <Text style={styles.sectionTitle}>Genre</Text>
                                <Text style={styles.text}>{genre}</Text>


                                {/* Close Button */}
                                {/* <TouchableOpacity style={styles.closeBtnContainer} onPress={onClose}>
                                    <Text style={styles.closeText}>Close</Text>
                                </TouchableOpacity> */}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default MovieInfoModal;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: isTablet ? 32 : 20,
        paddingTop: 20,
        // paddingBottom handled dynamically in component
        // maxHeight handled dynamically in component
        minHeight: screenHeight * 0.3, // Minimum 30% height for content
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerText: {
        color: Color.whiteText,
        fontSize: isTablet ? 24 : 20,
        fontFamily: font.PoppinsBold,
        flex: 1,
        textAlign: 'center',
    },
    title: {
        fontSize: isTablet ? 28 : 24,
        fontFamily: font.PoppinsBold,
        color: Color.whiteText,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: isTablet ? 16 : 14,
        color: Color.whiteText,
        marginTop: 16,
        marginBottom: 6,
        fontFamily: font.PoppinsBold,
    },
    text: {
        fontSize: isTablet ? 16 : 14,
        color: Color.whiteText,
        lineHeight: isTablet ? 24 : 21,
        marginBottom: 12,
        fontFamily: font.PoppinsRegular,
    },
    readMore: {
        color: Color.whiteText,
        fontSize: isTablet ? 15 : 13,
    },
});
