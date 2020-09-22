import React from 'react'

export default function Terms_03() {
    return (
        <div>
            <p className="termTitle">제1조 (목적)</p>
            이 약관은 KIS정보통신 주식회사(이하 “회사”라 합니다.) 제공하는 위치기반서비스와 관련하여 회사와 개인위치정보주체와의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

            <p className="termTitle">제2조 (약관 외 준칙)</p>
            이 약관에 명시되지 않은 사항은 위치정보의 보호 및 이용 등에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 전기통신기본법, 전기통신사업법 등 관계법령과 회사의 이용약관 및 개인정보처리방침, 회사가 별도로 정한 지침 등에 의합니다.

            <p className="termTitle">제3조 (서비스 내용 및 요금)</p>
            회사는 아래와 같은 위치기반서비스를 제공합니다. 
            <table className="termTable">
                <colgroup>
                    <col style={{'width':'20%'}} />
                    <col style={{'width':'40%'}} />
                    <col style={{'width':'40%'}} />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">구분</th>
                        <th scope="col">서비스 명칭 및 내용</th>
                        <th scope="col">요금</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="center">매장검색</td>
                        <td>
                            o 가까운 매장 찾기<br />
                            - 현재 위치 기반으로 주변 매장 위치 등의 매장 정보 제공 서비스
                        </td>
                        <td rowSpan="2">
                            o 서비스 이용 요금 : 무료<br /><br />
                            o 서비스 이용을 위한 데이터 통신 비용<br />
                            - 데이터 통신 비용은 별도이며 고객이 가입한 각 이동통신사의 정책에 따름
                        </td>
                    </tr>
                    <tr>
                        <td className="center">광고</td>
                        <td>
                            o 고객의 현재 위치를 활용한 광고 정보 제공 서비스
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="termTitle">제4조 (개인위치정보주체의 권리)</p>
            <ul className="termOne">
                <li><span className="termNum">1.</span>개인위치정보주체는 개인위치정보 수집 범위 및 개인위치정보의 이용ㆍ제공 목적, 제공받는 자의 범위 및 위치기반서비스의 동의를 유보할 수 있습니다.</li>
                <li><span className="termNum">2.</span>개인위치정보주체는 개인위치정보의 이용ㆍ제공에 대한 동의의 전부 또는 일부를 철회할 수 있습니다.</li>
                <li><span className="termNum">3.</span>개인위치정보주체는 언제든지 개인위치정보의 이용ㆍ제공의 일시적인 중지를 요구할 수 있습니다. 이 경우 회사는 신속하게 적절한 조치를 취합니다.</li>
                <li><span className="termNum">4.</span>개인위치정보주체는 회사에 대하여 아래 자료의 열람 또는 고지를 요구할 수 있고, 당해 자료에 오류가 있는 경우에는 그 정정을 요구할 수 있습니다. 이 경우 회사는 정당한 이유 없이 요구를 거절하지 아니합니다. 
                    <ul className="termTwo">
                        <li><span className="termNum">①</span>개인위치정보주체에 대한 위치정보 이용ㆍ제공사실 확인자료</li>
                        <li><span className="termNum">②</span>개인위치정보주체의 개인위치정보가 위치정보의 보호 및 이용 등에 관한 법률 또는 다른 법령의 규정에 의하여 제3자에게 제공된 이유 및 내용</li>
                    </ul>
                </li>
                <li><span className="termNum">5.</span>회사는 개인위치정보주체가 동의의 전부 또는 일부를 철회한 경우에는 지체 없이 수집된 개인위치정보 및 위치정보 이용ㆍ제공사실 확인자료를 파기합니다. 단, 동의의 일부를 철회하는 경우에는 철회하는 부분의 개인위치정보 및 위치정보 이용ㆍ제공사실 확인자료에 한합니다.</li>
                <li><span className="termNum">6.</span>개인위치정보주체는 제1항 내지 제4항의 권리행사를 이 약관 제12조의 연락처를 이용하여 회사에 요구할 수 있습니다.</li>
            </ul>

            <p className="termTitle">제5조 (법정대리인의 권리)</p>
            <ul className="termOne">
                <li><span className="termNum">1.</span>회사는 만14세 미만 아동으로부터 개인위치정보를 이용 또는 제공하고자 하는 경우에는 만14세 미만 아동과 그 법정대리인의 동의를 받아야 합니다.</li>
                <li><span className="termNum">2.</span>법정대리인은 만14세 미만 아동의 개인위치정보를 이용ㆍ제공에 동의하는 경우 동의유보권, 동의철회권 및 일시중지권, 열람ㆍ고지요구권을 행사할 수 있습니다.</li>
            </ul>

            <p className="termTitle">제6조 (8세 이하의 아동 등의 보호의무자의 권리)</p>
            <ul className="termOne">
                <li>
                    <span className="termNum">1.</span>회사는 아래의 경우에 해당하는 자(이하 “8세 이하의 아동 등”이라 한다)의 보호의무자가 8세 이하의 아동 등의 생명 또는 신체보호를 위하여 개인위치정보의 이용 또는 제공에 동의하는 경우에는 본인의 동의가 있는 것으로 봅니다.
                    <ul className="termTwo">
                        <li><span className="termNum">①</span>8세 이하의 아동</li>
                        <li><span className="termNum">②</span>피성년후견인</li>
                        <li><span className="termNum">③</span>장애인복지법 제2조 제2항 제2호의 규정에 의한 정신적 장애를 가진 자로서 장애인 고용 촉진 및 직업재활법 제2조제2호의 규정에 의한 중증장애인에 해당하는 자(장애인복지법 제29조의 규정에 의하여 장애인등록을 한 자에 한한다)</li>
                    </ul>
                </li>
                <li><span className="termNum">2.</span>8세 이하의 아동 등의 생명 또는 신체의 보호를 위하여 개인위치정보의 이용 또는 제공에 동의를 하고자 하는 보호의무자는 서면동의서에 보호의무자임을 증명하는 서면을 첨부하여 회사에 제출하여야 합니다.</li>
                <li><span className="termNum">3.</span>보호의무자는 8세 이하의 아동 등의 개인위치정보 이용 또는 제공에 동의하는 경우 개인위치정보주체 권리의 전부를 행사할 수 있습니다.</li>
            </ul>

            <p className="termTitle">제7조 (위치정보 이용ㆍ제공사실 확인자료 보유근거 및 보유기간)</p>
            회사는 위치정보의 보호 및 이용 등에 관한 법률 제16조 제2항에 근거하여 개인위치정보주체에 대한 위치정보 이용ㆍ제공사실 확인자료를 위치정보시스템에 자동으로 기록하며, 1년 이상 보관합니다.

            <p className="termTitle">제8조 (서비스의 변경 및 중지)</p>
            <ul className="termOne">
                <li><span className="termNum">1.</span>회사는 위치정보사업자의 정책변경 등과 같이 회사의 제반 사정 또는 법률상의 장애 등으로 서비스를 유지할 수 없는 경우, 서비스의 전부 또는 일부를 제한, 변경하거나 중지할 수 있습니다.</li>
                <li><span className="termNum">2.</span>제1항에 의한 서비스 중단의 경우에는 회사는 사전에 인터넷 등에 공지하거나 개인위치정보주체에게 통지합니다.</li>
            </ul>

            <p className="termTitle">제9조 (손해배상)</p>
            <ul className="termOne">
                <li><span className="termNum">1.</span>개인위치정보주체는 회사의 위치정보의 보호 및 이용 등에 관한 법률 제15조 내지 26조의 규정을 위반한 행위로 손해를 입은 경우에 회사에 대하여 손해배상을 청구할 수 있습니다. </li>
                <li><span className="termNum">2.</span>회사는 그 손해가 천재지변 등 불가항력적인 사유로 발생하였거나 이용자의 고의 또는 과실로 인하여 발생한 경우에는 손해를 배상하지 않습니다.</li>
            </ul>

            <p className="termTitle">제10조 (분쟁의 조정) </p>
            <ul className="termOne">
                <li><span className="termNum">1.</span>회사는 위치정보와 관련된 분쟁에 대하여 개인위치정보주체와 협의가 이루어지지 아니하거나 협의를 할 수 없는 경우에는 방송통신위원회에 재정을 신청할 수 있습니다.</li>
                <li><span className="termNum">2.</span>회사 또는 고객은 위치정보와 관련된 분쟁에 대해 당사자간 협의가 이루어지지 아니하거나 협의를 할 수 없는 경우에는 개인정보보호법 제43조의 규정에 의한 개인정보분쟁조정위원회에 조정을 신청할 수 있습니다.</li>
            </ul>

            <p className="termTitle">제11조 (사업자 정보 및 위치정보관리 책임자)</p>
            <ul className="termOne">
                <li>
                    <span className="termNum">1.</span>회사의 상호, 주소, 전화번호 그 밖의 연락처는 다음과 같습니다.
                    <ul className="termTwo">
                        <li>
                            <span className="termNum">①</span>매장 검색 서비스<br />
                            - 상  호 : KIS정보통신 주식회사<br />
                            - 담당자 : 조성태<br />
                            - 주  소 : 서울특별시 구로구 새말로 97, 센터포인트웨스트 22층<br />
                            - 대표번호 : 1599-3700
                        </li>
                    </ul>
                </li>
                <li>
                    <span className="termNum">2.</span>회사는 다음과 같이 위치정보 관리책임자를 지정하여 이용자들이 서비스 이용과정에서 발생한 민원사항 처리를 비롯하여 개인위치정보 주체의 권리 보호를 위해 힘쓰고 있습니다.
                    <ul className="termTwo">
                        <li>
                            <span className="termNum">①</span>매장검색 서비스<br />
                            - 담당자 : 김성유 실장<br />
                            - 연락처 : 02-2101-1689
                        </li>
                        <li>
                            <span className="termNum">②</span>광고 서비스<br />
                            - 담당자 : 김성유 실장<br />
                            - 연락처 : 02-2101-1689
                        </li>
                    </ul>
                </li>
            </ul>


            <p className="termDesc">(시행일) 이 약관은 2020년 07월 01일부터 시행합니다.</p>

        </div>
    )
}
