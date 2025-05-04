<template>
    <footer class="footer">
        <div class="footer-inner">
            <div class="footer-info">
                <div class="footer-company">
                    <strong>TODODDUDO</strong>
                </div>
                <div>사업자등록번호 : 123-45-67899</div>
                <div>주소 : (07060) 서울 동작구 보라매로 87</div>
                <div>대표 : DDIS</div>
                <div>이메일 : help@tododdudo.com</div>
            </div>
            <div class="footer-policy">
                <div>정책 관련 링크</div>
                <div>개인정보처리정책</div>
            </div>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 390px;
        height: 265px;
        z-index: 10;
        display: flex;
        align-items: flex-end;
    }

    .footer-inner {
        margin: 10px 0 0 5px;
        padding: 10px 34px 24px 34px;
        border-radius: 0 0 0 0;
        min-width: 300px;
        box-sizing: border-box;
        font-size: 10px;
        color: #222;
    }

    .footer-company {
        margin-bottom: 5px;
    }

    .footer-policy {
        margin-top: 10px;
        font-size: 10px;
        color: #222;
        line-height: 1.5;
    }

    @media (max-width: 1900px) {
        .footer {
            display: none;
        }
    }
</style>